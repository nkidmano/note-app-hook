import { API_URL } from '../environments';

export const getNoteApi = () => fetch(API_URL + '/note').then(response => response.json());

export const deleteNoteApi = noteId =>
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

export const addNoteApi = newNote =>
  fetch(API_URL + '/note', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Origin': '*',
    },
    body: JSON.stringify(newNote),
  });
