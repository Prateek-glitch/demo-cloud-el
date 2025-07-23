// src/components/Header.jsx
// Note: This Header.jsx assumes you have applied the previous fix to sync theme with App.jsx
// If not, please apply that fix first or replace your Header.jsx with the one provided below.

function Header({ isDarkMode, toggleDarkMode, categories, selectedCategory, onSelectCategory, searchQuery, onSearchChange }) {
  // Removed internal theme state and logic as it's now managed by App.jsx

  return (
    <header className="flex justify-between items-center px-4 py-3 bg-white dark:bg-gray-900 shadow-md">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">NoteNest</h1>
      <div className="flex items-center gap-4">
        {/* Category Filter Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => onSelectCategory(e.target.value)}
          className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-blue-500 capitalize"
        >
          {/* Map through the categories received from App.jsx */}
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search your notes"
          value={searchQuery} // --- NEW: Connect input value to state ---
          onChange={(e) => onSearchChange(e.target.value)} // --- NEW: Connect input change to handler ---
          className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={toggleDarkMode}
          className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-white"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}

export default Header;