import { useCallback, useState } from 'react';
import { createNote, updateNote, deleteNote, togglePinned, readNotes, writeNotes, makeDemoNotes } from '../utils/notes.js';

function initialState() {
  if (typeof window === 'undefined') return { notes: makeDemoNotes(), warning: '' };
  try { return readNotes(window.localStorage, makeDemoNotes()); }
  catch { return { notes: [], warning: 'Bu tarayıcıda yerel depolamaya erişilemiyor. Notlar yalnızca bu oturumda tutulabilir.' }; }
}

export default function useNotes() {
  const [state, setState] = useState(initialState);
  const persist = useCallback((notes) => {
    let warning;
    try { warning = writeNotes(window.localStorage, notes); }
    catch { warning = 'Yerel depolama kapalı. Notların yalnızca bu oturumda tutuluyor.'; }
    setState({ notes, warning });
  }, []);

  function add(draft) { persist([createNote(draft), ...state.notes]); }
  function edit(id, draft) { persist(updateNote(state.notes, id, draft)); }
  function remove(id) { persist(deleteNote(state.notes, id)); }
  function pin(id) { persist(togglePinned(state.notes, id)); }
  return { ...state, add, edit, remove, pin };
}
