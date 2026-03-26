import bcrypt from "bcrypt";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import http from "http";
import { initGraphQL } from "./graphql.js";
import { PORT } from "./config.js";
import { Event, Participant, User } from "./models.js";
import { Server } from "socket.io";

mongoose.connect("mongodb://localhost:27019/finance-school")
.then(() => console.log("MongoDB підключено"))
.catch(err => console.error("Помилка MongoDB:", err));

const app = express();
app.use(express.json());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("Користувач підключився");

  socket.on("message", (msg) => {
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("Користувач відключився");
  });
});

server.listen(PORT, () => {
  console.log(`Сервер запущено: http://localhost:${PORT}`);
});

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(session({
  secret: "keyromankey",
  resave: false,
  saveUninitialized: false,
}));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

await initGraphQL(app);

app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.json({ message: "Користувач зареєстрований!" });
  } catch (err) {
    res.status(400).json({ error: "Помилка при реєстрації" });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "Неправильний логін" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Неправильний пароль" });

  req.session.userId = user._id;
  req.session.role = user.role;
  res.json({ message: "Успішний логін!" });
});

function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Необхідна авторизація" });
  }
  next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.session.role || req.session.role !== role) {
      return res.status(403).json({ error: "Доступ заборонено" });
    }
    next();
  };
}

app.get("/api/events", async (req, res) => {
  try {
    let { page = 1, limit = 5, sort = "date", order = "asc" } = req.query;
    page = Number(page);
    limit = Number(limit);

    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: "page і limit повинні бути >= 1" });
    }

    const events = await Event.find()
      .sort({ [sort]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Event.countDocuments();

    res.json({
      page, limit, total,
      data: events.map(e => ({
        ...e.toObject(),
        date: e.date.toISOString().split("T")[0]
      }))
    });
  } catch (err) {
    console.error("Помилка отримання подій:", err);
    res.status(500).json({ error: "Не вдалося отримати події" });
  }
});

app.get("/api/events/cursor", async (req, res) => {
  try {
    let { lastId, limit = 5 } = req.query;
    limit = Number(limit);

    let query = {};
    if (lastId && lastId !== "null" && lastId !== "") {
      query = { _id: { $gt: new mongoose.Types.ObjectId(lastId) } };
    }

    const events = await Event.find(query)
      .sort({ _id: 1 })
      .limit(limit);

    res.json(events.map(e => ({
      ...e.toObject(),
      date: e.date instanceof Date ? e.date.toISOString().split("T")[0] : e.date
    })));
  } catch (err) {
    console.error("Cursor error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/events", requireAuth, async (req, res) => {
  try {
    const { title, date, description } = req.body;
    const event = new Event({
      title,
      date,
      description,
      creator: req.session.userId
    });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: "Не вдалося створити подію" });
  }
});

app.put("/api/events/:id", requireAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Подію не знайдено" });

    if (event.creator.toString() !== req.session.userId) {
      return res.status(403).json({ error: "Ви можете редагувати тільки свої події" });
    }

    Object.assign(event, req.body);
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: "Не вдалося оновити подію" });
  }
});

app.delete("/api/events/:id", requireAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Подію не знайдено" });

    if (req.session.role !== "Admin" && event.creator.toString() !== req.session.userId) {
      return res.status(403).json({ error: "Ви можете видаляти тільки свої події" });
    }

    await event.deleteOne();
    res.json({ message: "Подію видалено" });
  } catch (err) {
    res.status(500).json({ error: "Не вдалося видалити подію" });
  }
});

app.get("/api/participants/cursor/:eventId", requireAuth, async (req, res) => {
  try {
    let { lastId, limit = 5 } = req.query;
    limit = Number(limit);

    const query = { eventId: req.params.eventId };
    if (lastId) {
      query._id = { $gt: lastId };
    }

    const participants = await Participant.find(query)
      .sort({ _id: 1 })
      .limit(limit);

    res.json(participants);
  } catch (err) {
    res.status(500).json({ error: "Не вдалося отримати учасників" });
  }
});

app.get("/api/participants/:eventId", requireAuth, async (req, res) => {
  try {
    const participants = await Participant.find({ eventId: req.params.eventId });
    res.json(participants);
  } catch (err) {
    res.status(500).json({ error: "Не вдалося отримати учасників" });
  }
});

app.post("/api/participants", requireAuth, async (req, res) => {
  try {
    const { eventId } = req.body;

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: "Користувача не знайдено" });
    }

    const participant = new Participant({
      fullName: user.username,
      email: user.email,
      eventId,
      createdAt: new Date()
    });

    await participant.save();
    res.status(201).json(participant);
  } catch (err) {
    console.error("Помилка додавання учасника:", err);
    res.status(500).json({ error: "Не вдалося зареєструватися на подію" });
  }
});

app.put("/api/participants/:id", requireAuth, async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    if (!participant) return res.status(404).json({ error: "Учасника не знайдено" });

    if (participant.email !== req.session.email && req.session.role !== "Admin") {
      return res.status(403).json({ error: "Ви можете редагувати тільки свої дані" });
    }

    Object.assign(participant, req.body);
    await participant.save();
    res.json(participant);
  } catch (err) {
    res.status(500).json({ error: "Не вдалося оновити учасника" });
  }
});

app.delete("/api/participants/:id", requireAuth, async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    if (!participant) return res.status(404).json({ error: "Учасника не знайдено" });

    if (participant.email !== req.session.email && req.session.role !== "Admin") {
      return res.status(403).json({ error: "Ви можете видаляти тільки свої дані" });
    }

    await participant.deleteOne();
    res.json({ message: "Учасника видалено" });
  } catch (err) {
    res.status(500).json({ error: "Не вдалося видалити учасника" });
  }
});

app.get("/api/stats/participants", async (req, res) => {
  try {
    const stats = await Participant.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(stats.map(s => ({ date: s._id, count: s.count })));
  } catch (err) {
    res.status(500).json({ error: "Не вдалося отримати статистику" });
  }
});