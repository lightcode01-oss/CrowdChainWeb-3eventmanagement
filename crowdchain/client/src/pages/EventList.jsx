import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Users, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/events');
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] justify-center items-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto"
    >
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-4">
            Upcoming Events
          </h1>
          <p className="text-gray-400">Discover and secure your spot on the blockchain.</p>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="glass text-center py-20 rounded-3xl border-dashed border-2 border-white/10">
          <p className="text-gray-400 text-lg">No events found. Be the first to create one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              key={event._id} 
              className="glass-card flex flex-col overflow-hidden group"
            >
              <div className="h-48 bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 relative">
                {/* Abstract decorative shapes inside header */}
                <div className="absolute top-4 right-4 w-16 h-16 bg-white/5 rounded-full blur-xl group-hover:bg-blue-500/30 transition-all"></div>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <div className="glass px-3 py-1 rounded-full text-xs font-semibold text-blue-300">
                    {event.ticketPrice} ETH
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-2xl font-bold mb-3 text-white truncate">{event.eventName}</h2>
                <p className="text-gray-400 text-sm mb-6 line-clamp-2">{event.description}</p>
                
                <div className="space-y-3 mb-8 flex-grow">
                  <div className="flex items-center text-gray-300 text-sm gap-3">
                    <Calendar className="w-4 h-4 text-blue-400" /> 
                    {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex items-center text-gray-300 text-sm gap-3">
                    <MapPin className="w-4 h-4 text-pink-400" /> 
                    {event.location}
                  </div>
                  <div className="flex items-center text-gray-300 text-sm gap-3">
                    <Users className="w-4 h-4 text-green-400" /> 
                    Capacity: {event.maxCapacity}
                  </div>
                </div>
                
                <Link to={`/events/${event._id}`} className="mt-auto">
                  <button className="w-full bg-white/5 hover:bg-blue-600 text-white py-3 rounded-xl transition-all font-medium border border-white/10 hover:border-transparent group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    View Details
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default EventList;
