import { useEffect, useRef } from "react";

export default function PerformanceChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Sample equity curve data
    const data = [
      10000, 10250, 10100, 10450, 10300, 10750, 10600, 11000, 10850, 11200,
      11050, 11400, 11250, 11600, 11450, 11800, 11650, 12000, 11850, 12200,
      12050, 12400, 12250, 12600, 12450, 12800, 12650, 13000, 12850, 13200
    ];

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const valueRange = maxValue - minValue;

    // Draw equity curve
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((value, index) => {
      const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((value - minValue) / valueRange) * (height - 2 * padding);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw grid lines
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 1;

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * (height - 2 * padding);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i <= 5; i++) {
      const x = padding + (i / 5) * (width - 2 * padding);
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    // Draw axes labels
    ctx.fillStyle = '#666';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';

    // Y-axis labels
    for (let i = 0; i <= 5; i++) {
      const y = height - padding + 5 - (i / 5) * (height - 2 * padding);
      const value = minValue + (i / 5) * valueRange;
      ctx.fillText(`$${value.toFixed(0)}`, 20, y);
    }

    // X-axis labels
    ctx.fillText('Start', padding, height - 10);
    ctx.fillText('End', width - padding, height - 10);

  }, []);

  return (
    <div className="w-full">
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={300} 
        className="w-full h-64 border border-border rounded"
      />
    </div>
  );
}