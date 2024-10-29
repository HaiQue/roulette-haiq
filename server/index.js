const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data', 'data.txt');

app.use(cors());
app.use(express.json());

// Helper function to read data from data.txt
const readDataFile = () => {
  try {
    return fs.readFileSync(DATA_FILE, 'utf-8').trim();
  } catch (err) {
    console.error('Error reading data file:', err);
    return '';
  }
};

// Helper function to write data to data.txt
const writeDataFile = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, data);
  } catch (err) {
    console.error('Error writing data file:', err);
  }
};

// POST endpoint to save a number
app.post('/save-number', (req, res) => {
  const { number } = req.body;

  if (number < 0 || number > 36) {
    return res.status(400).json({ message: 'Number must be between 0 and 36.' });
  }

  const currentData = readDataFile();
  const newData = [number, currentData].filter(Boolean).join(', ');
  writeDataFile(newData);

  res.json({ message: 'Number saved successfully!' });
});

// DELETE endpoint to undo the last added number
app.delete('/undo', (req, res) => {
  const currentData = readDataFile();
  const numbers = currentData.split(',').map((n) => n.trim()).filter(Boolean);

  if (numbers.length > 0) {
    numbers.shift(); // Remove the most recent entry
    writeDataFile(numbers.join(', '));
    return res.json({ message: 'Last number removed successfully!' });
  } else {
    return res.status(400).json({ message: 'No numbers to undo.' });
  }
});

// GET endpoint to fetch the current data
app.get('/data', (req, res) => {
  const currentData = readDataFile();
  res.send(currentData);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
