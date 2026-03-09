// import mongoose from "mongoose";
// import { Event, Participant } from "./models.js";

// await mongoose.connect("mongodb://localhost:27019/finance-school");
// console.log("Підключено до MongoDB!");

// await Event.deleteMany({});
// await Participant.deleteMany({});

// const events = await Event.insertMany([
//   {
//     title: "Фінанси для початківців",
//     description: "Основи управління особистими фінансами",
//     date: new Date("2026-03-10"),
//     organizer: "Finance School",
//   },
//   {
//     title: "Інвестування без страху",
//     description: "Як почати інвестувати з нуля",
//     date: new Date("2026-03-15"),
//     organizer: "Invest Lab",
//   },
//   {
//     title: "Пасивний дохід",
//     description: "Створення джерел стабільного доходу",
//     date: new Date("2026-03-20"),
//     organizer: "Money Academy",
//   }
// ]);

// console.log("Seed дані додано!");
// process.exit();


import mongoose from "mongoose";
import { Event } from "./models.js";

async function seed() {
  await mongoose.connect("mongodb://localhost:27019/finance-school");
  await Event.deleteMany({});

  const events = [];
  for (let i = 1; i <= 50; i++) {
    events.push({
      title: `Подія №${i}`,
      date: new Date(2026, 0, i),
      description: `Опис події №${i}`,
    });
  }

  await Event.insertMany(events);
  console.log("50 подій додано!");
  mongoose.disconnect();
}

seed();

