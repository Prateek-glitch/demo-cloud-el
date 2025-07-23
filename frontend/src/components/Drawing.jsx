import { useRef, useEffect, useState } from 'react';

function DrawingCanvas({ onSave }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 500;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#fff';
    ctx.fillStyle = '#1f2937'; // Tailwind dark gray-800
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDraw = (e) => {
    setIsDrawing(true);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const handleSave = () => {
    const dataUrl = canvasRef.current.toDataURL();
    onSave(dataUrl);
  };

  return (
    <div className="space-y-2">
      <canvas
        ref={canvasRef}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        className="border-2 border-gray-600 rounded cursor-crosshair"
      />
      <button
        onClick={handleSave}
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
      >
        Save Drawing
      </button>
    </div>
  );
}

export default DrawingCanvas;
