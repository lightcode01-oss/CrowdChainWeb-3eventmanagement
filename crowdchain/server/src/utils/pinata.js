// server/src/utils/pinata.js
exports.pinJSONToIPFS = async (jsonData) => {
  try {
    const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
    
    // We can use the JWT token as it's the recommended modern way
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: JSON.stringify({
        pinataContent: jsonData,
        pinataOptions: {
          cidVersion: 1
        },
        pinataMetadata: {
          name: jsonData.eventName ? `Event_${jsonData.eventName}.json` : 'Event_Metadata.json'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Error pinning to IPFS: ${response.statusText}`);
    }

    const data = await response.json();
    return data.IpfsHash;
  } catch (error) {
    console.error('Pinata upload error:', error);
    return null; // Return null on failure so event creation logic can handle it gracefully
  }
};
