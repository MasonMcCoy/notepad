const express = require('express');
const path = require('path');
const fs = require('fs');
const savedNotes = require('./db/db.json');
const PORT = process.env.PORT || 3001;

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

// Renders notes HTML
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html')));

// Returns existing notes to lefthand pane
app.get('/api/notes', (req, res) => {
    res.json(savedNotes);
});

// Add new notes
app.post('/api/notes', (req, res) => {
    savedNotes.push(req.body);
    
    savedNotes.forEach((note, index) => {
      note.id = index + 1;
    })

    fs.writeFile('./db/db.json', JSON.stringify(savedNotes), (err => 
      err ? console.error(err) : console.log(`${req.method} request made`)
      ));
})

// Deletes note at id (index)
app.delete('/api/notes/:id', (req, res) => {
  savedNotes.splice(req.params.id - 1, 1)

  fs.writeFile('./db/db.json', JSON.stringify(savedNotes), (err => 
    err ? console.error(err) : console.log(`${req.method} request made`)
    ));
})

app.listen(PORT, () =>
  console.log(`App listening at ${PORT}`)
);