// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import NoteCard from '../components/NoteCard';
import NoteModal from "../components/AddNoteModal";

// If you're still using IndexedDB, these stay
import { getAllNotes, saveNoteToDB, deleteNoteFromDB } from '../utils/idb';

function HomePage({ selectedCategoryFilter, onUpdateCategories, searchQuery }) {
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  // Load from IndexedDB (or you could load from DynamoDB if needed here too)
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const storedNotes = await getAllNotes();
        setNotes(storedNotes);
      } catch (error) {
        console.error("Failed to load notes from IndexedDB:", error);
      }
    };
    loadNotes();
  }, []);

  useEffect(() => {
    const uniqueCategories = ['All', ...new Set(notes.map(note => note.category).filter(Boolean))];
    onUpdateCategories(uniqueCategories);
  }, [notes, onUpdateCategories]);

  // Save note (from modal) — this handles both local and AWS notes
  const handleSaveNote = async (note) => {
    try {
      const noteId = note.noteId || note.id || Date.now(); // AWS or local fallback
      const noteToSave = { ...note, id: noteId };

      await saveNoteToDB(noteToSave); // Save to IndexedDB (so it's cached)

      setNotes(prevNotes => {
        const exists = prevNotes.some(n => n.id === noteToSave.id);
        return exists
          ? prevNotes.map(n => (n.id === noteToSave.id ? noteToSave : n))
          : [noteToSave, ...prevNotes];
      });

      setIsModalOpen(false);
      setCurrentNote(null);
    } catch (error) {
      console.error("Failed to save note:", error);
      alert("Failed to save note. Please try again.");
    }
  };

  // Delete note
  const handleDeleteNote = async (id) => {
    try {
      await deleteNoteFromDB(id);
      setNotes(prevNotes => prevNotes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Failed to delete note:", error);
      alert("Failed to delete note. Please try again.");
    }
  };

  const handleEditNote = (note) => {
    setCurrentNote(note);
    setIsModalOpen(true);
  };

  // Filter notes
  const filteredNotes = notes.filter(note => {
    const matchesCategory =
      selectedCategoryFilter === 'All' || note.category === selectedCategoryFilter;

    const matchesSearch =
      searchQuery.toLowerCase() === '' ||
      (note.title && note.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Your Notes</h2>
        <button
          onClick={() => {
            setCurrentNote(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg flex items-center justify-center transition-colors duration-200"
          aria-label="Add new note"
        >
          <PlusCircle size={24} />
        </button>
      </div>

      {/* Note grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <NoteCard
              key={note.id || note.noteId}
              {...note}
              onEdit={() => handleEditNote(note)}
              onDelete={() => handleDeleteNote(note.id || note.noteId)}
            />
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No notes found. Create one!</p>
        )}
      </div>

      {/* Modal (used for both add & edit) */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNote}
        note={currentNote}
      />
    </div>
  );
}

export default HomePage;
