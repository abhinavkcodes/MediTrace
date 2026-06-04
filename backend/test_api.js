const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/medicines',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Success:', json.success);
      console.log('Count:', json.count);
      console.log('First medicine:', json.data ? json.data[0] : 'No data');
    } catch (e) {
      console.log('Response:', data.substring(0, 200));
    }
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.end();