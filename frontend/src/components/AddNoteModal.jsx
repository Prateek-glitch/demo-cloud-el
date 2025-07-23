// src/components/AddNoteModal.jsx
import { useState, useEffect, useRef } from 'react';
import Drawing from './Drawing';
import AudioPlayer from './AudioPlayer';
import { motion } from 'framer-motion';

function AddNoteModal({ isOpen, onClose, onSave, initialType, initialData }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [noteType, setNoteType] = useState(initialType || 'text');
  const [color, setColor] = useState('blue');
  const [imageFile, setImageFile] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recording, setRecording] = useState(false);
  const [drawingData, setDrawingData] = useState(null);
  const [category, setCategory] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || '');
      setContent(
        initialData?.type === 'list'
          ? (initialData?.content || []).join('\n')
          : initialData?.content || ''
      );
      setNoteType(initialData?.type || initialType || 'text');
      setColor(initialData?.color || 'blue');
      setImageFile(null);
      setAudioBlob(null);
      setDrawingData(initialData?.drawing || null);
      setCategory(initialData?.category || '');
      setIsPinned(initialData?.isPinned || false);

      if (initialData?.reminderTimestamp) {
        const dateObj = new Date(initialData.reminderTimestamp);
        setReminderDate(dateObj.toISOString().split('T')[0]);
        setReminderTime(dateObj.toTimeString().slice(0, 5));
      } else {
        setReminderDate('');
        setReminderTime('');
      }

      if (initialData?.type === 'image' && initialData.image instanceof Blob) {
        setImageFile(initialData.image);
      }
      if (initialData?.type === 'audio' && initialData.audio instanceof Blob) {
        setAudioBlob(initialData.audio);
      }
    }
  }, [isOpen, initialType, initialData]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      alert('Microphone access denied or unavailable.');
    }
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    let contentToSave = content;
    if (noteType === 'list') {
      contentToSave = content.split('\n').filter((line) => line.trim());
    }

    let reminderTimestamp = null;
    if (reminderDate && reminderTime) {
      reminderTimestamp = new Date(`${reminderDate}T${reminderTime}:00`).toISOString();
    }

    const noteData = {
      title,
      type: noteType,
      color,
      content: contentToSave,
      category: category.trim() || null,
      isPinned,
      reminderTimestamp,
      drawing: noteType === 'drawing' ? drawingData : null,
      image: null,
      audio: null,
    };

    try {
      const res = await fetch('https://nj5o6p2sj5.execute-api.ap-south-1.amazonaws.com/prod/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData),
      });

      const result = await res.json();
      console.log('Note saved to AWS:', result);

      // ✅ Trigger UI update with full note data and AWS-generated ID
      if (onSave && typeof onSave === 'function') {
        onSave({
          ...noteData,
          id: result.noteId,
          noteId: result.noteId,
        });
      }

      onClose();
    } catch (err) {
      console.error('Error saving note to AWS:', err);
      alert('Failed to save note. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-900 text-white p-6 rounded-xl w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">{initialData ? 'Edit Note' : 'Add Note'}</h2>

        {!initialType && (
          <div className="flex gap-2 mb-4">
            {['text', 'list', 'image', 'audio', 'drawing'].map((type) => (
              <button
                key={type}
                onClick={() => setNoteType(type)}
                className={`px-2 py-1 rounded bg-gray-700 text-sm ${noteType === type ? 'bg-blue-600' : ''}`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* FORM UI unchanged below */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-800 placeholder-gray-400"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            className="w-full p-2 rounded bg-gray-800 placeholder-gray-400"
            placeholder="Category (e.g., Work, Personal, Ideas)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="reminderDate" className="block text-sm text-gray-300 mb-1">Reminder Date</label>
              <input
                type="date"
                id="reminderDate"
                className="w-full p-2 rounded bg-gray-800 text-white"
                value={reminderDate || ''}
                onChange={(e) => setReminderDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="reminderTime" className="block text-sm text-gray-300 mb-1">Reminder Time</label>
              <input
                type="time"
                id="reminderTime"
                className="w-full p-2 rounded bg-gray-800 text-white"
                value={reminderTime || ''}
                onChange={(e) => setReminderTime(e.target.value)}
              />
            </div>
          </div>

          {['text', 'list'].includes(noteType) && (
            <textarea
              className="w-full p-2 rounded bg-gray-800 placeholder-gray-400"
              placeholder={noteType === 'list' ? 'Enter each item on a new line' : 'Write your note...'}
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          )}

          {noteType === 'image' && (
            <div className="space-y-2">
              <label className="block text-sm text-gray-300">Choose Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 rounded bg-gray-800"
              />
              {imageFile && (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="mt-2 max-h-48 w-auto mx-auto rounded-lg object-contain"
                />
              )}
            </div>
          )}

          {noteType === 'audio' && (
            <div className="space-y-3">
              {!recording ? (
                <button
                  type="button"
                  onClick={handleStartRecording}
                  className="w-full py-2 px-4 bg-rose-700 hover:bg-rose-800 rounded shadow"
                >
                  🎙️ Start Recording
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-black rounded shadow"
                >
                  ⏹️ Stop Recording
                </button>
              )}

              <div className="text-center text-sm text-gray-400">or</div>

              <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-sm inline-flex gap-2">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setAudioBlob(e.target.files[0])}
                  className="hidden"
                />
                📁 Upload Audio
              </label>

              {(audioBlob || initialData?.audio) && (
                <div className="mt-3 bg-gray-800 rounded-lg p-2">
                  <label className="text-sm text-gray-300 block mb-1">Preview:</label>
                  <AudioPlayer src={audioBlob ? URL.createObjectURL(audioBlob) : initialData?.audio} />
                </div>
              )}
            </div>
          )}

          {noteType === 'drawing' && (
            <Drawing onSave={(data) => setDrawingData(data)} initialDrawing={drawingData} />
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pinNote"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="form-checkbox h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="pinNote" className="text-sm text-gray-300">Pin to top</label>
          </div>

          <div className="flex gap-2">
            {['white', 'green', 'red', 'purple', 'black'].map((clr) => (
              <button
                key={clr}
                type="button"
                onClick={() => setColor(clr)}
                className={`w-6 h-6 rounded-full ring-2 ${color === clr ? 'ring-white' : 'ring-transparent'}`}
                style={{ backgroundColor: clr }}
              />
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1 bg-gray-700 rounded">
              Cancel
            </button>
            <button type="submit" className="px-3 py-1 bg-blue-600 rounded">
              {initialData ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default AddNoteModal;
