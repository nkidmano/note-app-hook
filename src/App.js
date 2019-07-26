import React, { useEffect, useReducer, useCallback } from 'react';
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
    case 'delete': {
      draft.notes = draft.notes.filter(note => note.id !== action.payload);
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

// shoud you Map
function useCheckbox(initial) {
  const [value, setValue] = useState(initial);
  const result = {};
  result.value = value;
  result.setValue = setValue;
  result.check = useCallback(index =>
    setValue(v => [...v].splice(index, 1, !value[index]))
  );
  return result;
}

function App() {
  const [state, dispatch] = useReducer(produce(noteReducer), initialState);
  const { notes, noteInput } = state;
  const noteCheckbox = useCheckbox(notes);

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

  function deleteNote(noteId) {
    fetch(API_URL + '/note/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Origin': '*',
      },
      body: JSON.stringify({
        id: noteId,
      }),
    });

    dispatch({ type: 'delete', payload: noteId });
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
          <div className='column has-text-centered'>
            <strong>Delete</strong>
            {notes.map(note => (
              <div key={note.id} className='notes'>
                <strong
                  style={{ cursor: 'pointer' }}
                  onClick={() => deleteNote(note.id)}
                >
                  X
                </strong>
              </div>
            ))}
          </div>

          <div className='column has-text-centered'>
            <button>Delete selected</button>
            {notes.map(note => (
              <div key={note.id} className='notes'>
                <input type='checkbox' value={note.id} />
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
