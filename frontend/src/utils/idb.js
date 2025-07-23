// src/utils/idb.js

const DB_NAME = 'NoteNestDB';
const DB_VERSION = 1;
const STORE_NAME = 'notes';

let db; // This will hold the IndexedDB database instance

/**
 * Opens and initializes the IndexedDB database.
 * If the database or object store doesn't exist, it creates them.
 * @returns {Promise<IDBDatabase>} A promise that resolves with the database instance.
 */
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      // This event is triggered when the database is being created or upgraded.
      db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // Create an object store to hold our notes.
        // We set 'id' as the keyPath because each note will have a unique 'id' property.
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      // The database opened successfully.
      db = event.target.result;
      resolve(db);
    };

    request.onerror = (event) => {
      // Handle errors during database opening.
      console.error('IndexedDB error:', event.target.errorCode, event.target.error);
      reject('Failed to open IndexedDB');
    };
  });
}

/**
 * Gets the IndexedDB database instance. If not already open, it opens it.
 * @returns {Promise<IDBDatabase>} A promise that resolves with the database instance.
 */
async function getDB() {
  if (!db) {
    db = await openDB();
  }
  return db;
}

/**
 * Retrieves all notes from the IndexedDB.
 * @returns {Promise<Array>} A promise that resolves with an array of notes, sorted by ID (newest first).
 */
export async function getAllNotes() {
  const db = await getDB();
  const transaction = db.transaction(STORE_NAME, 'readonly'); // Read-only transaction
  const store = transaction.objectStore(STORE_NAME);
  const request = store.getAll(); // Get all objects in the store

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      // Sort notes by ID in descending order (newest first).
      const notes = request.result.sort((a, b) => b.id - a.id);
      resolve(notes);
    };
    request.onerror = (event) => {
      console.error('Error getting all notes:', event.target.errorCode, event.target.error);
      reject('Error getting all notes');
    };
  });
}

/**
 * Saves a single note to IndexedDB.
 * If the note has an 'id', it updates the existing note; otherwise, it adds a new note.
 * @param {Object} note - The note object to save.
 * @returns {Promise<void>} A promise that resolves when the note is saved.
 */
export async function saveNoteToDB(note) {
  const db = await getDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite'); // Read-write transaction
  const store = transaction.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    // put() method adds a new record or updates an existing one if the key (id) matches.
    const request = store.put(note);

    request.onsuccess = () => {
      resolve();
    };
    request.onerror = (event) => {
      console.error('Error saving note:', event.target.errorCode, event.target.error);
      reject('Error saving note');
    };
  });
}

/**
 * Deletes a note from IndexedDB by its ID.
 * @param {number} id - The ID of the note to delete.
 * @returns {Promise<void>} A promise that resolves when the note is deleted.
 */
export async function deleteNoteFromDB(id) {
  const db = await getDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite'); // Read-write transaction
  const store = transaction.objectStore(STORE_NAME);
  const request = store.delete(id); // Delete the record by its key (id)

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve();
    };
    request.onerror = (event) => {
      console.error('Error deleting note:', event.target.errorCode, event.target.error);
      reject('Error deleting note');
    };
  });
}