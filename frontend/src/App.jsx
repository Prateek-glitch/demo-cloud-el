// src/App.jsx
import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import SettingsPage from './pages/SettingsPage';
import Header from './components/Header';
import AddNoteModal from './components/AddNoteModal'; // ✅ added
import NoteCard from './components/NoteCard'; // just in case you're using it here too

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') return true;
  if (savedTheme === 'light') return false;
  return true;
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme());
  const [categories, setCategories] = useState([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false); // ✅ new
  const [notes, setNotes] = useState([]); // ✅ new

  // ✅ Handle saving note from modal
  const handleAddNote = (newNote) => {
    setNotes((prevNotes) => [...prevNotes, newNote]);
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
      console.log('beforeinstallprompt event fired.');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const handleUpdateCategories = useCallback((newCategories) => {
    if (JSON.stringify(newCategories) !== JSON.stringify(categories)) {
      setCategories(newCategories);
    }
  }, [categories]);

  const handleCategoryFilterChange = (category) => {
    setSelectedCategoryFilter(category);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setShowInstallButton(false);
    }
  };

  return (
    <Router>
      <div
        className={`min-h-screen ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
        } transition-colors duration-300`}
      >
        <Header
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          categories={categories}
          selectedCategory={selectedCategoryFilter}
          onSelectCategory={handleCategoryFilterChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        {/* FAB for adding a new note */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg text-xl z-50"
          title="Add Note"
        >
          ➕
        </button>

        {/* Add Note Modal (with AWS save + note update) */}
        <AddNoteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddNote} // ✅ pass saved note back to state
        />

        <main className="container mx-auto p-4 pt-20">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  notes={notes} // ✅ pass new notes to HomePage
                  selectedCategoryFilter={selectedCategoryFilter}
                  onUpdateCategories={handleUpdateCategories}
                  searchQuery={searchQuery}
                />
              }
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>

        {showInstallButton && (
          <button
            onClick={handleInstallClick}
            className="fixed bottom-4 left-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 z-50"
            aria-label="Install App"
          >
            Install App
          </button>
        )}
      </div>
    </Router>
  );
}

export default App;
