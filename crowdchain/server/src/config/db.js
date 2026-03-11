const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../../data');

const initCSV = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const files = [
    { name: 'users.csv', headers: 'id,walletAddress,role,createdAt\n' },
    { name: 'events.csv', headers: 'id,eventName,description,date,location,maxCapacity,ticketPrice,adminWallet,createdAt\n' },
    { name: 'tickets.csv', headers: 'id,ticketId,eventId,ownerWallet,qrCode,status,createdAt\n' },
    { name: 'crowds.csv', headers: 'id,eventId,peopleInside,capacity,createdAt\n' }
  ];

  files.forEach(file => {
    const filePath = path.join(dataDir, file.name);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, file.headers);
      console.log(`Created ${file.name}`);
    }
  });
  console.log('CSV Database Initialized');
};

module.exports = initCSV;
