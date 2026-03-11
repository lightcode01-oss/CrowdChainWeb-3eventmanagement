const crypto = require('crypto');
const uuidv4 = () => crypto.randomUUID();
const QRCode = require('qrcode');
const { readAll, insertRecord, updateRecord } = require('../utils/csvStore');

// POST /tickets/buy
exports.buyTicket = async (req, res) => {
  try {
    const { eventId, ownerWallet, txHash } = req.body;

    const events = readAll('events');
    const event = events.find(e => e.id === eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Ensure capacity is not exceeded before finalizing
    const tickets = readAll('tickets');
    const ticketsSold = tickets.filter(t => t.eventId === eventId).length;
    
    if (ticketsSold >= Number(event.maxCapacity)) {
      return res.status(400).json({ error: 'Event is sold out' });
    }

    const ticketId = uuidv4();

    // Generate QR code based on ticketId
    const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify({ ticketId, eventId }));

    const newTicket = {
      id: uuidv4(),
      ticketId,
      eventId,
      ownerWallet: ownerWallet.toLowerCase(),
      qrCode: qrCodeDataUrl,
      status: 'valid',
      createdAt: new Date().toISOString()
    };

    insertRecord('tickets', newTicket);

    res.status(201).json({ message: 'Ticket purchased successfully', ticket: { ...newTicket, _id: newTicket.id } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// GET /tickets/user/:wallet
exports.getUserTickets = async (req, res) => {
  try {
    const { wallet } = req.params;
    const tickets = readAll('tickets').filter(t => t.ownerWallet === wallet.toLowerCase());
    const events = readAll('events');
    
    // Simulate mongoose populate for 'eventId'
    const populatedTickets = tickets.map(t => {
      const e = events.find(ev => ev.id === t.eventId);
      return { 
        ...t, 
        _id: t.id, 
        eventId: e ? { ...e, _id: e.id, maxCapacity: Number(e.maxCapacity), ticketPrice: Number(e.ticketPrice) } : null 
      };
    });

    res.json(populatedTickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /tickets/verify
exports.verifyTicket = async (req, res) => {
  try {
    const { ticketId } = req.body;

    const tickets = readAll('tickets');
    const ticket = tickets.find(t => t.ticketId === ticketId);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    if (ticket.status === 'used') {
      return res.status(400).json({ error: 'Ticket has already been used' });
    }

    const events = readAll('events');
    const event = events.find(e => e.id === ticket.eventId);

    // Check crowd capacity
    const crowds = readAll('crowds');
    let crowd = crowds.find(c => c.eventId === ticket.eventId);
    
    if (!crowd) {
       // fallback if somehow crowd entry missing
       crowd = { id: uuidv4(), eventId: ticket.eventId, capacity: event.maxCapacity, peopleInside: 0, createdAt: new Date().toISOString() };
       insertRecord('crowds', crowd);
    }

    if (Number(crowd.peopleInside) >= Number(crowd.capacity)) {
      return res.status(400).json({ error: 'Max capacity reached, cannot allow entry' });
    }

    // Update ticket to used
    const updatedTicket = updateRecord('tickets', 'id', ticket.id, { status: 'used' });

    // Increment crowd
    const newPeopleCount = Number(crowd.peopleInside) + 1;
    updateRecord('crowds', 'id', crowd.id, { peopleInside: String(newPeopleCount) });

    const populatedTicket = {
      ...updatedTicket,
      _id: updatedTicket.id,
      eventId: event ? { ...event, _id: event.id } : null
    };

    res.json({ message: 'Ticket verified successfully. Entry granted!', ticket: populatedTicket, peopleInside: newPeopleCount });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
