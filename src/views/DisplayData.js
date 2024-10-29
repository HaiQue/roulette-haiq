import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DisplayData.css';

const DisplayData = () => {
  const [number, setNumber] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [currentStreaks, setCurrentStreaks] = useState({ red: 0, black: 0 });

  const redNumbers = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
  const blackNumbers = new Set([2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (number >= 0 && number <= 36) {
      try {
        const response = await axios.post('http://localhost:5000/save-number', {
          number,
        });
        setMessage(response.data.message);
        setMessageType('success');
        setNumber('');
        fetchCurrentStreaks();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Error saving number:', error);
        setMessage('Failed to save number.');
        setMessageType('error');
        setTimeout(() => setMessage(''), 3000);
      }
    } else {
      setMessage('Please enter a number between 0 and 36.');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    }
  };

    const handleUndo = async () => {
    try {
      const response = await axios.delete('http://localhost:5000/undo');
      setMessage(response.data.message);
      setMessageType('success');
      fetchCurrentStreaks();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error undoing the last number:', error);
      setMessage('Failed to undo.');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    }
  };

   const fetchCurrentStreaks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/data');
      const numbers = response.data.split(',').map(Number);
      const currentStreakData = calculateCurrentStreak(numbers);
      setCurrentStreaks(currentStreakData);
    } catch (error) {
      console.error('Error fetching data for streak calculation:', error);
    }
  };

    const calculateCurrentStreak = (numbers) => {
    let redStreak = 0;
    let blackStreak = 0;

    for (let i = numbers.length - 1; i >= 0; i--) {
      const num = numbers[i];
      if (redNumbers.has(num)) {
        redStreak++;
        if (blackStreak > 0) break;
      } else if (blackNumbers.has(num)) {
        blackStreak++;
        if (redStreak > 0) break;
      } else {
        break;
      }
    }

    return { red: redStreak, black: blackStreak };
  };

  useEffect(() => {
    fetchCurrentStreaks();
  }, []);

  useEffect(() => { fetchCurrentStreaks(); }, []);

 // Layout with single `0` aligned to the left
 const rouletteLayout = [
    [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
    [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
    [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
  ];

  return (
    <div>
      <h2>Enter a number between 0 and 36</h2>
      <form onSubmit={handleSubmit}>
        <input type='number' value={number} onChange={(e) => setNumber(e.target.value)} min='0' max='36' />
        <button type='submit'>Save Number</button>
      </form>
      <button onClick={handleUndo}>Undo Last Number</button>
      {message && <div className={`message ${messageType}`}>{message}</div>}

      <h3>Current Streaks</h3>
      <table border='1'>
        <thead>
          <tr><th>Streak Type</th><th>Current Length</th></tr>
        </thead>
        <tbody>
          <tr><td>Streak Red</td><td>{currentStreaks.red}</td></tr>
          <tr><td>Streak Black</td><td>{currentStreaks.black}</td></tr>
        </tbody>
      </table>

      <h3>Roulette Table</h3>
      <div className='roulette-table'>
        <div className='roulette-zero'>0</div>
        {rouletteLayout.map((row, rowIndex) => (
          <div key={rowIndex} className='roulette-row'>
            {row.map((num, colIndex) => (
              <div
                key={colIndex}
                className={`roulette-number ${redNumbers.has(num) ? 'red' : blackNumbers.has(num) ? 'black' : 'green'}`}
              >
                {num}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayData;