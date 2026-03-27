import mongoose from "mongoose";
import { Event, User } from "./models.js";

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await Event.deleteMany({});
  let user = await User.findOne();
  if (!user) {
    user = await User.create({ username: "TestUser", password: "123456789", role: "User", email: "testuser@example.com" });
  }

  const events = [];
  for (let i = 1; i <= 50; i++) {
    events.push({
      title: `Подія №${i}`,
      date: new Date(2026, 0, i),
      description: `Опис події №${i}`,
      creator: user._id,
    });
  }

  await Event.insertMany(events);
  console.log("50 подій додано!");
  mongoose.disconnect();
}

seed();

