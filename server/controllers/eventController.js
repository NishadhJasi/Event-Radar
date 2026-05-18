const Event = require("../models/event");

exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, category, image } = req.body;

    if (!title || !description || !date || !location || !category) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled.",
      });
    }

    const newEvent = await Event.create({
      title,
      description,
      date,
      location,
      category,
      organizer: req.user.name,
      organizerId: req.user._id,
      image: image || "",
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error. Could not create event.",
    });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (category) {
      filter.category = new RegExp(category, "i");
    }

    if (search) {
      filter.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { location: new RegExp(search, "i") },
        { organizer: new RegExp(search, "i") },
      ];
    }

    const events = await Event.find(filter).sort({ date: 1 });
    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch events.",
    });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }
    res.status(200).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not fetch event." });
  }
};

exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizerId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not fetch your events." });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    if (event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to edit this event." });
    }

    const { title, description, date, location, category, image } = req.body;

    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = date;
    if (location) event.location = location;
    if (category) event.category = category;
    if (image !== undefined) event.image = image;

    await event.save();

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    if (event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this event." });
    }

    await event.deleteOne();

    res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getParticipants = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    if (event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }

    res.status(200).json({
      success: true,
      participants: event.participants,
      count: event.participants.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addAnnouncement = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: "Announcement message is required." });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    if (event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }

    event.announcements.unshift({ message });
    await event.save();

    res.status(200).json({
      success: true,
      message: "Announcement posted",
      announcements: event.announcements,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrganizerStats = async (req, res) => {
  try {
    const events = await Event.find({ organizerId: req.user._id });
    const totalEvents = events.length;
    const totalParticipants = events.reduce((sum, e) => sum + e.participants.length, 0);

    res.status(200).json({
      success: true,
      stats: { totalEvents, totalParticipants },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
