import express from "express";
import { readFile } from "node:fs/promises";
import { PORT, DATA_FILE } from "./config.js";
import cors from "cors";

const app = express();
app.use(cors());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get("/api/events", async (req, res) => {
  try {
    const rawData = await readFile(DATA_FILE, "utf-8");
    let events = JSON.parse(rawData);

    let { page = 1, limit = 5, sort = "date", order = "asc" } = req.query;
    page = Number(page);
    limit = Number(limit);

    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: "page і limit повинні бути >= 1" });
    }

    if (sort === "date") {
      events.sort((a, b) =>
        order === "asc"
          ? a.date.localeCompare(b.date)
          : b.date.localeCompare(a.date)
      );
    } else if (sort === "title") {
      events.sort((a, b) =>
        order === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title)
      );
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedEvents = events.slice(start, end);

    res.json({
      page,
      limit,
      total: events.length,
      data: paginatedEvents,
    });
  } catch (err) {
    console.error("Помилка читання файлу:", err);
    res.status(500).json({ error: "Не вдалося прочитати файл" });
  }
});

app.listen(PORT, () => {
  console.log(`Express сервер запущено: http://localhost:${PORT}/api/events`);
});
