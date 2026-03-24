import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
import { useWallet } from '../context/WalletContext';
import { motion } from 'framer-motion';
import { QrCode, Ticket as TicketIcon, ExternalLink } from 'lucide-react';


const MyTickets = () => {
  const { address } = useWallet();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (address) fetchTickets();
  }, [address]);

  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/tickets/user/${address}`);
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!address) {
    return (
      <div className="flex h-[60vh] justify-center items-center">
        <div className="glass p-12 text-center rounded-3xl max-w-md">
          <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <TicketIcon className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Login Required</h2>
          <p className="text-gray-400">Connect your Web3 wallet via the Navbar to securely access your digital venue tickets.</p>
        </div>
      </div>
    );
  }

  if (loading) return <div className="text-center py-20 text-blue-400 animate-pulse">Loading Web3 Assets...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">My Digital Vault</h1>
      <p className="text-gray-400 mb-10">Your securely owned cryptographic event passes.</p>
      
      {tickets.length === 0 ? (
        <div className="glass text-center py-24 rounded-3xl border-dashed border-2 border-white/10">
          <p className="text-gray-400 text-lg">Your vault is empty. Purchase a ticket to see it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {tickets.map((ticket, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              key={ticket._id} 
              className="glass p-0 rounded-2xl flex overflow-hidden group shadow-2xl relative"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl transition-opacity ${ticket.status === 'used' ? 'opacity-0' : 'opacity-100 group-hover:opacity-100 group-hover:bg-blue-400/30'}`}></div>
              
              {/* Event Info Ticket Slice */}
              <div className="w-2/3 p-6 sm:p-8 flex flex-col justify-between border-r border-dashed border-gray-700 relative z-10 bg-black/20">
                <div>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-wider ${ticket.status === 'used' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-400'}`}>
                    {ticket.status}
                  </div>
                  <h3 className="text-2xl font-black mb-2 truncate">
                    {ticket.eventId?.eventName || 'Unknown Event'}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {ticket.eventId ? new Date(ticket.eventId.date).toLocaleDateString() : 'TBA'}
                  </p>
                </div>
                
                <div className="mt-8">
                  <p className="text-gray-500 text-xs mb-1">Blockchain ID</p>
                  <p className="text-blue-300 text-xs font-mono truncate">{ticket.ticketId}</p>
                  {ticket.ipfsHash && (
                    <a href={`https://orange-large-frog-571.mypinata.cloud/ipfs/${ticket.ipfsHash}?pinataGatewayToken=IdcZ3d9KzO46VQT8fz8W6PKgIS6bkQmGL6sX7WyS7P8OLhOz6DRykoGDDWzkTAn_`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-pink-400 hover:text-pink-300 bg-pink-500/10 px-3 py-1.5 rounded-full border border-pink-500/20 transition-all">
                      <ExternalLink className="w-3 h-3" /> View on Pinata IPFS
                    </a>
                  )}
                </div>

              </div>
              
              {/* QR Code Slice */}
              <div className="w-1/3 flex flex-col items-center justify-center p-6 bg-white shrink-0 relative">
                {/* Visual perforations */}
                <div className="absolute top-0 -left-3 w-6 h-6 bg-gray-950 rounded-full"></div>
                <div className="absolute bottom-0 -left-3 w-6 h-6 bg-gray-950 rounded-full"></div>
                
                {ticket.status === 'used' ? (
                  <div className="text-red-600 text-center font-bold rotate-[-15deg] text-xl border-4 border-red-600 py-2 px-4 rounded-xl">
                    SCANNED
                  </div>
                ) : (
                  <>
                    <img src={ticket.qrCode} alt="Ticket QR" className="w-full max-w-[150px] aspect-square" />
                    <p className="text-gray-900 font-bold text-xs mt-3 flex items-center gap-1"><QrCode className="w-3 h-3"/> Gate Pass</p>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;
