import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
import { useWallet } from '../context/WalletContext';
import { motion } from 'framer-motion';
import { Ticket, Users, MapPin, Calendar, ExternalLink, Activity, ShieldCheck } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { address } = useWallet();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    fetchEventDetails();
    // Refresh crowd capacity every 10s
    const interval = setInterval(fetchEventDetails, 10000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/events/${id}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const buyTicket = async () => {
    if (!address) return alert('Please connect your metamask wallet first!');
    if (data.crowd.peopleInside >= data.event.maxCapacity) return alert('Event is sold out!');

    setBuying(true);
    try {
      // Simulate blockchain tx delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      const simulatedTxHash = "0x" + Math.random().toString(16).slice(2, 42);

      const res = await axios.post(`${API_URL}/api/tickets/buy`, {
        eventId: id,
        ownerWallet: address,
        txHash: simulatedTxHash
      });

      alert('Ticket purchased successfully!');
      navigate('/my-tickets');
    } catch (err) {
      alert(err.response?.data?.error || 'Purchase failed');
    } finally {
      setBuying(false);
    }
  };

  if (loading || !data) return <div className="flex h-[60vh] justify-center items-center"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;

  const { event, crowd } = data;
  const isSoldOut = crowd.peopleInside >= event.maxCapacity;
  const capacityPercent = Math.min(100, Math.round((crowd.peopleInside / event.maxCapacity) * 100));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
      
      {/* Left Column - Details */}
      <div className="lg:col-span-2 space-y-8">
        <div className="glass p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">{event.eventName}</h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">{event.description}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/5 p-6 rounded-2xl border border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-blue-400"><Calendar className="w-5 h-5"/></div>
              <div>
                <p className="text-sm text-gray-400">Date & Time</p>
                <p className="font-semibold text-white">{new Date(event.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-pink-400"><MapPin className="w-5 h-5"/></div>
              <div>
                <p className="text-sm text-gray-400">Location</p>
                <p className="font-semibold text-white">{event.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Booking Card */}
      <div className="space-y-6">
        <div className="glass-card p-6 sticky top-28">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold">Checkout</h2>
            <div className="text-right">
              <p className="text-sm text-gray-400">Price</p>
              <p className="text-3xl font-black text-blue-400">{event.ticketPrice} ETH</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400 flex items-center gap-2"><Activity className="w-4 h-4"/> Live Capacity</span>
              <span className="text-white font-medium">{crowd.peopleInside} / {event.maxCapacity}</span>
            </div>
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${capacityPercent > 90 ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${capacityPercent}%` }}
              ></div>
            </div>
          </div>

          <button 
            onClick={buyTicket} 
            disabled={buying || isSoldOut}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${
              isSoldOut 
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-blue-500/25'
            }`}
          >
            {buying ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Minting...</> :
             isSoldOut ? 'Sold Out' : <><Ticket className="w-5 h-5"/> Buy Ticket Now</>}
          </button>
          
          <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4"/> Secured by Ethereum Smart Contracts
          </p>
        </div>
      </div>
      
    </motion.div>
  );
};

export default EventDetails;
