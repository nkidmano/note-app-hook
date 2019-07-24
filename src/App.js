import React, { useState, useEffect, useCallback } from 'react';

const API_URL = 'http://localhost:3333';

function App() {
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState('');

  const addNote = useCallback(event => {
    if (event.key === 'Enter') {
      fetch(API_URL + '/note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Origin': '*',
        },
        body: JSON.stringify({
          id: Date.now(),
          content: noteInput,
          timestamp: new Date().toLocaleString(),
        }),
      });
      setNoteInput('');
    }
  }, []);

  useEffect(() => {
    fetch(API_URL + '/note')
      .then(response => response.json())
      .then(response => setNotes(response));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(API_URL + '/note')
        .then(response => response.json())
        .then(response => setNotes(response));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='app'>
      <div className='notes-section'>
        <div className='columns'>
          <div className='column has-text-centered'>
            <strong>Notes</strong>
            {notes.map(note => (
              <div key={note.id} className='notes'>
                {note.content}
              </div>
            ))}
          </div>
          <div className='column has-text-centered'>
            <strong>Timestamp</strong>
            {notes.map(note => (
              <div key={note.id} className='notes'>
                {note.timestamp}
              </div>
            ))}
          </div>
        </div>
        <input
          placeholder='Enter a note'
          className='input is-small'
          type='text'
          value={noteInput}
          onKeyPress={addNote}
          onChange={event => setNoteInput(event.target.value)}
        />
      </div>
      <div className='note-count'>
        Note count: <strong>{notes.length}</strong>
      </div>
    </div>
  );
}

export default App;
