import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
import { Scanner } from '@yudiel/react-qr-scanner';
import { useWallet } from '../context/WalletContext';
import { PlusCircle, Shield, CheckCircle, AlertCircle, Maximize, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { address } = useWallet();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ eventName: '', description: '', date: '', location: '', maxCapacity: '', ticketPrice: '' });
  const [scanResult, setScanResult] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/events`);
      setEvents(res.filter(e => e.adminWallet.toLowerCase() === address?.toLowerCase()));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!address) return alert('Connect wallet first!');
    try {
      await axios.post(`${API_URL}/api/events`, { ...form, adminWallet: address });
      alert('Event Created Successfully!');
      setForm({ eventName: '', description: '', date: '', location: '', maxCapacity: '', ticketPrice: '' });
      fetchEvents();
    } catch (err) {
      alert('Error creating event.');
    }
  };

  const handleScan = async (results) => {
    // yudiel scanner returns an array of results
    const text = Array.isArray(results) ? results[0]?.rawValue : results;
    
    if (text && !verifying) {
      setVerifying(true);
      try {
        const parsedData = JSON.parse(text);
        const res = await axios.post(`${API_URL}/api/tickets/verify`, { ticketId: parsedData.ticketId });
        setScanResult({ success: true, message: res.data.message });
      } catch (err) {
        setScanResult({ success: false, message: err.response?.data?.error || 'Invalid or Scanned Ticket' });
      } finally {
        setTimeout(() => { setVerifying(false); setScanResult(null); setScannerOpen(false); }, 3000);
      }
    }
  };

  if (!address) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="glass p-12 text-center rounded-3xl border-2 border-dashed border-white/20">
          <Shield className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
          <h2 className="text-xl font-bold mb-2">Organizer Access Only</h2>
          <p className="text-gray-400 max-w-sm">Connect your admin wallet to create events and manage entry gates.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
      
      {/* Event Creation Form */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <PlusCircle className="text-blue-500" /> Create New Event
        </h2>
        <form onSubmit={handleCreate} className="glass p-8 rounded-3xl space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Event Name</label>
            <input type="text" placeholder="e.g. Solidity Summit 2026" className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-blue-500 transition-colors" required onChange={e => setForm({...form, eventName: e.target.value})} value={form.eventName} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <textarea placeholder="Describe the event..." className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-blue-500 transition-colors h-28" required onChange={e => setForm({...form, description: e.target.value})} value={form.description}></textarea>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
              <input type="date" className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-blue-500 transition-colors" required onChange={e => setForm({...form, date: e.target.value})} value={form.date} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
              <input type="text" placeholder="Metaverse / IRL" className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-blue-500 transition-colors" required onChange={e => setForm({...form, location: e.target.value})} value={form.location} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Max Capacity</label>
              <input type="number" placeholder="1000" className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-blue-500 transition-colors" required onChange={e => setForm({...form, maxCapacity: e.target.value})} value={form.maxCapacity} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Ticket Price (ETH)</label>
              <input type="step" step="0.001" placeholder="0.05" className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-blue-500 transition-colors" required onChange={e => setForm({...form, ticketPrice: e.target.value})} value={form.ticketPrice} />
            </div>
          </div>

          <button type="submit" className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all hover:shadow-blue-500/30">
            Publish on Chain
          </button>
        </form>
      </motion.div>

      {/* QR Scanner & Dashboard Stats */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
        
        <div>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Maximize className="text-purple-500" /> Ground Control
          </h2>
          <div className="glass p-8 rounded-3xl text-center">
            {scannerOpen ? (
               <div className="relative rounded-2xl overflow-hidden border-2 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                  <Scanner onScan={handleScan} components={{ finder: true, audio: false }} styles={{ container: { borderRadius: '1rem' } }} />
                  {verifying && <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm"><Loader2 className="w-10 h-10 animate-spin text-blue-400"/></div>}
                  {scanResult && (
                    <div className={`absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md p-6 ${scanResult.success ? 'bg-green-500/80' : 'bg-red-500/80'}`}>
                      {scanResult.success ? <CheckCircle className="w-16 h-16 text-white mb-2" /> : <AlertCircle className="w-16 h-16 text-white mb-2" />}
                      <h3 className="text-white text-xl font-bold text-center">{scanResult.message}</h3>
                    </div>
                  )}
                  <button onClick={() => setScannerOpen(false)} className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-full font-bold text-sm">Close Radar</button>
               </div>
            ) : (
              <div>
                <button onClick={() => setScannerOpen(true)} className="w-full bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 py-12 rounded-2xl flex flex-col items-center justify-center transition-all group">
                  <Maximize className="w-12 h-12 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-xl">Activate QR Radar</span>
                  <span className="text-gray-400 text-sm mt-2">Scan attendee gate passes</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Managed Events List */}
        <div>
          <h3 className="text-xl font-bold mb-4">Your Hosted Events</h3>
          {events.length === 0 ? (
            <div className="glass p-6 text-center rounded-2xl border border-white/5 text-gray-400 text-sm">
              You haven't published any events yet.
            </div>
          ) : (
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {events.map((e) => (
                <div key={e._id} className="glass p-4 rounded-xl flex justify-between items-center border border-white/5 hover:border-blue-500/30 transition-colors">
                  <div>
                    <h4 className="font-bold truncate max-w-[200px]">{e.eventName}</h4>
                    <p className="text-xs text-gray-400">{new Date(e.date).toLocaleDateString()} • {e.ticketPrice} ETH</p>
                  </div>
                  <div className="text-right">
                    <span className="bg-blue-500/20 text-blue-400 text-xs py-1 px-3 rounded-full font-medium">Active</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </motion.div>
    </div>
  );
};

export default AdminDashboard;
