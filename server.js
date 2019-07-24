const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

const NOTE_DATA_FILE = path.join(__dirname, 'server-note-data.json');

app.set('port', process.env.PORT || 3333);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.get('/note', (req, res) => {
  fs.readFile(NOTE_DATA_FILE, (err, data) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  });
});

app.post('/note', (req, res) => {
  fs.readFile(NOTE_DATA_FILE, (err, data) => {
    const notes = JSON.parse(data);
    notes.push({
      id: req.body.id,
      content: req.body.content,
      timestamp: req.body.timestamp,
    });

    fs.writeFile(NOTE_DATA_FILE, JSON.stringify(notes, null, 4), () => {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(notes);
    });
  });
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});
