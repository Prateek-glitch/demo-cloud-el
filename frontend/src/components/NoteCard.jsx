// src/components/NoteCard.jsx
import AudioPlayer from './AudioPlayer';
import { Tag, Pin, PinOff, Clock } from 'lucide-react'; // --- MODIFIED: Import Clock icon ---

function NoteCard({ title, content, color = 'blue', type = 'text', image, audio, drawing, onEdit, onDelete,
  category,
  isPinned,
  onTogglePin,
  // --- NEW: Accept reminderTimestamp prop ---
  reminderTimestamp
}) {
  const colorMap = {
    blue: 'bg-blue-600',
    yellow: 'bg-yellow-400',
    green: 'bg-green-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-400',
    black: 'bg-gray-700',
    white: 'bg-gray-200 text-gray-900',
  };

  // --- NEW: Format reminder timestamp ---
  const formattedReminder = reminderTimestamp
    ? new Date(reminderTimestamp).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : null;


  return (
    <div className={`relative rounded-2xl shadow-md p-4 ${colorMap[color]} bg-opacity-10 backdrop-blur-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white space-y-2`}>

      {/* Edit/Delete/Pin controls */}
      <div className="absolute top-2 right-2 flex gap-2 text-sm">
        {/* Pin/Unpin Button */}
        {onTogglePin && (
          <button
            onClick={onTogglePin}
            className={`p-1 rounded-full ${isPinned ? 'text-blue-500' : 'text-gray-400 hover:text-blue-400'}`}
            title={isPinned ? 'Unpin note' : 'Pin note'}
          >
            {isPinned ? <Pin size={18} fill="currentColor" /> : <PinOff size={18} />}
          </button>
        )}

        {onEdit && (
          <button
            onClick={onEdit}
            className="text-blue-500 hover:text-blue-700"
            title="Edit note"
          >
            ✏️
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700"
            title="Delete note"
          >
            🗑️
          </button>
        )}
      </div>

      {/* Note content */}
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${colorMap[color]}`}></div>
        <h2 className="font-semibold text-lg line-clamp-1">{title}</h2>
      </div>

      {category && (
        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 mt-1">
          <Tag size={14} className="text-gray-500" />
          <span className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full capitalize">
            {category}
          </span>
        </div>
      )}

      {/* --- NEW: Display reminder timestamp if available --- */}
      {formattedReminder && (
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
          <Clock size={14} className="text-gray-500" />
          <span>{formattedReminder}</span>
        </div>
      )}


      {type === 'text' && <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 whitespace-pre-line">{content}</p>}

      {type === 'list' && (
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
          {content && content.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <input type="checkbox" className="accent-blue-500" disabled />
              <span className="line-clamp-1">{item}</span>
            </li>
          ))}
        </ul>
      )}

      {type === 'image' && image && (
        <img src={URL.createObjectURL(image)} alt="Note" className="w-full h-32 object-cover rounded-lg mt-2" />
      )}

      {type === 'audio' && audio && (
        <div className="mt-2">
          <AudioPlayer src={URL.createObjectURL(audio)} />
        </div>
      )}

      {type === 'drawing' && drawing && (
        <img src={drawing} alt="Drawing" className="w-full h-32 object-contain rounded-lg mt-2 bg-gray-700" />
      )}
    </div>
  );
}

export default NoteCard;