// src/pages/SettingsPage.jsx
import React from 'react';

function SettingsPage() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Settings</h1>
      <p className="text-lg">Configure your application settings here.</p>
      <ul className="list-disc list-inside mt-4 text-sm text-gray-700 dark:text-gray-300">
        <li>Theme: Dark/Light Mode (Already handled)</li>
        <li>(Add more settings options here later if desired)</li>
      </ul>
    </div>
  );
}

export default SettingsPage;