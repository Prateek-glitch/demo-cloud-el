import { useState } from 'react';
import { Mic, Image as ImageIcon, Pencil, ListTodo, Type, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function FAB({ onSelectType }) {
  const [isOpen, setIsOpen] = useState(false);

  const buttons = [
    { label: 'Audio', icon: <Mic size={16} />, type: 'audio' },
    { label: 'Image', icon: <ImageIcon size={16} />, type: 'image' },
    { label: 'Drawing', icon: <Pencil size={16} />, type: 'drawing' },
    { label: 'List', icon: <ListTodo size={16} />, type: 'list' },
    { label: 'Text', icon: <Type size={16} />, type: 'text' },
  ];

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end z-50">
      <AnimatePresence>
        {isOpen &&
          buttons.map((btn, idx) => (
            <motion.button
              key={idx}
              onClick={() => {
                onSelectType(btn.type);
                setIsOpen(false);
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className="mb-3 flex items-center gap-2 rounded-full bg-rose-700 hover:bg-rose-800 text-white px-3 py-2 shadow-lg backdrop-blur-sm"
            >
              {btn.icon}
              <span className="text-sm">{btn.label}</span>
            </motion.button>
          ))}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 bg-rose-500 hover:bg-rose-600 text-white text-2xl rounded-full shadow-xl flex items-center justify-center ring-2 ring-rose-300 animate-pulse"
      >
        {isOpen ? <X size={28} /> : '+'}
      </motion.button>
    </div>
  );
}

export default FAB;