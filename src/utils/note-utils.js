export const createNote = noteInput => {
  const result = {};
  result.id = Date.now();
  result.content = noteInput;
  result.timestamp = new Date().toLocaleString();
  return result;
};
