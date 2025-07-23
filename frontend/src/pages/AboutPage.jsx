// src/pages/AboutPage.jsx
import React from 'react';

function AboutPage() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">About NoteNest</h1>
      <p className="text-lg">NoteNest is a simple and intuitive note-taking application designed to help you organize your thoughts and reminders efficiently.</p>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Version: 1.0.0
      </p>
    </div>
  );
}

export default AboutPage;