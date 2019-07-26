import React, { useEffect, useReducer } from 'react';
import { produce } from 'immer';

const API_URL = 'http://localhost:3333';

function noteReducer(draft, action) {
  switch (action.type) {
    case 'field': {
      draft[action.fieldName] = action.payload;
      return;
    }
    case 'fetch': {
      draft.notes = action.payload;
      return;
    }
    case 'add': {
      draft.notes.push(action.payload);
      draft.noteInput = '';
      return;
    }
    default:
      return;
  }
}

const initialState = {
  notes: [],
  noteInput: '',
};

function App() {
  const [state, dispatch] = useReducer(produce(noteReducer), initialState);
  const { notes, noteInput } = state;

  useEffect(() => {
    fetch(API_URL + '/note')
      .then(response => response.json())
      .then(response => dispatch({ type: 'fetch', payload: response }));
  }, []);

  function addNote(event) {
    if (event.key === 'Enter' && noteInput.trim() !== '') {
      const newNote = createNote();

      fetch(API_URL + '/note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Origin': '*',
        },
        body: JSON.stringify(newNote),
      });

      dispatch({ type: 'add', payload: newNote });

      function createNote() {
        const result = {};
        result.id = Date.now();
        result.content = noteInput;
        result.timestamp = new Date().toLocaleString();
        return result;
      }
    }
  }

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
          onChange={event =>
            dispatch({
              type: 'field',
              fieldName: 'noteInput',
              payload: event.target.value,
            })
          }
        />
      </div>
      <div className='note-count'>
        Note count: <strong>{notes.length}</strong>
      </div>
    </div>
  );
}

export default App;
