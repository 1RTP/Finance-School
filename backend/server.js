import http from "node:http";
import { readFile } from "node:fs/promises";
import { URL } from "node:url";
import { PORT, DATA_FILE } from "./config.js";

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  console.log(`[${new Date().toISOString()}] ${req.method} ${url.pathname}`);

  if (url.pathname === "/api/events" && req.method === "GET") {
    try {
      const data = await readFile(DATA_FILE, "utf-8");
      sendJson(res, 200, JSON.parse(data));
    } catch (err) {
      sendJson(res, 500, { error: "Не вдалося прочитати файл" });
    }
  } else if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
  } else {
    sendJson(res, 404, { error: "Маршрут не знайдено" });
  }
});

server.listen(PORT, () => {
  console.log(`Сервер запущено: http://localhost:${PORT}/api/events`);
});
