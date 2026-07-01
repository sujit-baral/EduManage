import Event from "../models/Event.js";
import EventRegistration from "../models/EventRegistration.js";

export const getEvents = async (req, res) => {
  res.json(await Event.find().sort({ date: 1 }));
};

export const createEvent = async (req, res) => {
  const event = await Event.create({
    ...req.body,
    createdBy: req.user?.name || req.body.createdBy || "Admin",
  });
  res.status(201).json(event);
};

export const deleteEvent = async (req, res) => {
  await EventRegistration.deleteMany({ eventId: req.params.id });
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  res.json({ message: "Event deleted" });
};

export const getMyEventRegistrations = async (req, res) => {
  const registrations = await EventRegistration.find({ studentId: req.user.id });
  res.json(registrations);
};

// Issue #7: Fixed race condition with atomic $inc instead of read-increment-save
export const registerForEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  if (event.maxParticipants && event.registeredCount >= event.maxParticipants) {
    res.status(400);
    throw new Error("Event is full");
  }

  const existing = await EventRegistration.findOne({
    eventId: event.id,
    studentId: req.user.id,
  });
  if (existing) {
    res.status(409);
    throw new Error("Already registered for this event");
  }

  await EventRegistration.create({
    eventId: event.id,
    studentId: req.user.id,
  });

  // Issue #7: Atomic increment prevents race condition
  const updatedEvent = await Event.findByIdAndUpdate(
    event.id,
    { $inc: { registeredCount: 1 } },
    { new: true }
  );

  res.json(updatedEvent);
};
