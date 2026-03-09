import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { PORT } from "./config.js";
import { Event, Participant } from "./models.js";

mongoose.connect("mongodb://localhost:27019/finance-school")
.then(() => console.log("MongoDB підключено"))
.catch(err => console.error("Помилка MongoDB:", err));

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

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

    res.json({ page, limit, total,
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

app.get("/api/participants/:eventId", async (req, res) => {
  try {
    const participants = await Participant.find({ eventId: req.params.eventId });
    res.json(participants);
  } catch (err) {
    console.error("Помилка отримання учасників:", err);
    res.status(500).json({ error: "Не вдалося отримати учасників" });
  }
});

app.listen(PORT, () => {
  console.log(`Express сервер запущено: http://localhost:${PORT}/api/events`);
});

app.post("/api/participants", async (req, res) => {
  try {
    const participant = new Participant(req.body);
    await participant.save();
    res.status(201).json(participant);
  } catch (err) {
    console.error("Помилка додавання учасника:", err);
    res.status(500).json({ error: "Не вдалося додати учасника" });
  }
});

app.get("/api/events/cursor", async (req, res) => {
  try {
    let { lastId, limit = 5 } = req.query;
    limit = Number(limit);

    const query = lastId ? { _id: { $gt: lastId } } : {};

    const events = await Event.find(query)
      .sort({ _id: 1 })
      .limit(limit);

    res.json(events.map(e => ({
      ...e.toObject(),
      date: e.date.toISOString().split("T")[0]
    })));
  } catch (err) {
    console.error("Помилка cursor-пагінації:", err);
    res.status(500).json({ error: "Не вдалося отримати події" });
  }
});

app.get("/api/participants/cursor/:eventId", async (req, res) => {
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
    console.error("Помилка cursor-пагінації учасників:", err);
    res.status(500).json({ error: "Не вдалося отримати учасників" });
  }
});


