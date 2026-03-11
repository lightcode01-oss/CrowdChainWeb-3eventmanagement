const crypto = require('crypto');
const uuidv4 = () => crypto.randomUUID();
const { readAll, insertRecord } = require('../utils/csvStore');

// GET /events
exports.getEvents = async (req, res) => {
  try {
    const events = readAll('events');
    // Map id to _id for frontend compatibility
    const mappedEvents = events.map(e => ({ ...e, _id: e.id, maxCapacity: Number(e.maxCapacity), ticketPrice: Number(e.ticketPrice) }));
    res.json(mappedEvents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /events/:id
exports.getEventById = async (req, res) => {
  try {
    const events = readAll('events');
    const event = events.find(e => e.id === req.params.id);
    
    if (!event) return res.status(404).json({ error: 'Event not found' });
    
    const mappedEvent = { ...event, _id: event.id, maxCapacity: Number(event.maxCapacity), ticketPrice: Number(event.ticketPrice) };
    
    const crowds = readAll('crowds');
    const crowd = crowds.find(c => c.eventId === event.id) || { peopleInside: 0, capacity: event.maxCapacity };
    
    res.json({ event: mappedEvent, crowd: { ...crowd, peopleInside: Number(crowd.peopleInside), capacity: Number(crowd.capacity) } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /events
exports.createEvent = async (req, res) => {
  try {
    const { eventName, description, date, location, maxCapacity, ticketPrice, adminWallet } = req.body;
    
    const newEvent = {
      id: uuidv4(),
      eventName,
      description,
      date,
      location,
      maxCapacity,
      ticketPrice,
      adminWallet,
      createdAt: new Date().toISOString()
    };

    insertRecord('events', newEvent);

    // Create corresponding Crowd tracker
    const newCrowd = {
      id: uuidv4(),
      eventId: newEvent.id,
      capacity: maxCapacity,
      peopleInside: 0,
      createdAt: new Date().toISOString()
    };
    insertRecord('crowds', newCrowd);

    res.status(201).json({ ...newEvent, _id: newEvent.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
