import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: String,
  date: Date,
  description: String,
});

const participantSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  eventId: mongoose.Schema.Types.ObjectId,
  birthDate: Date,
  source: String,
  createdAt: Date,
});

eventSchema.index({ date: 1 });
eventSchema.index({ title: 1 });
participantSchema.index({ eventId: 1 });
participantSchema.index({ email: 1 });

export const Event = mongoose.model("Event", eventSchema);
export const Participant = mongoose.model("Participant", participantSchema);
