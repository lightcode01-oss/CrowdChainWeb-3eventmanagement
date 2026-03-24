const crypto = require('crypto');
const uuidv4 = () => crypto.randomUUID();
const { readAll, insertRecord, deleteRecord } = require('../utils/csvStore');
const { pinJSONToIPFS } = require('../utils/pinata');


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

    // Upload to IPFS via Pinata
    const ipfsHash = await pinJSONToIPFS(newEvent);
    if (ipfsHash) {
      newEvent.ipfsHash = ipfsHash;
    }

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

// DELETE /events/:id
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const events = readAll('events');
    const event = events.find(e => e.id === id);
    
    if (!event) return res.status(404).json({ error: 'Event not found' });
    
    if (req.user && req.user.walletAddress.toLowerCase() !== event.adminWallet.toLowerCase()) {
      return res.status(403).json({ error: 'Unauthorized to delete this event' });
    }

    deleteRecord('events', 'id', id);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
