const axios = require('axios');

// Function to send the POST request
async function sendPostRequest() {
    console.log("hitting post req");
  try {
    const response = await axios.post(`${process.env.API_URL}/notify/subscribe`, {
    });

    console.log('POST request successful:', response.data);
  } catch (error) {
    console.error('Error sending POST request:', error.message);
  }
}

// Function to hit the POST request every 24 hours (24 * 60 * 60 * 1000 milliseconds)
function schedulePostRequest() {
    console.log("sending");
    const interval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
//   const interval = 60000; // 1 min in milliseconds for testing
    setInterval(sendPostRequest, interval);
}

// Start the scheduled post requests
schedulePostRequest();
