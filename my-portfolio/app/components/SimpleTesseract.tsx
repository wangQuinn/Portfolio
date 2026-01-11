'use client';

import { useEffect, useRef } from 'react';

const SimpleTesseract = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let theta = 0;
    let animationId: number | null = null;

    // 16 vertices of the 8-cell
    const vertices4D: [number, number, number, number][] = [];
    for (let x of [-1, 1])
      for (let y of [-1, 1])
        for (let z of [-1, 1])
          for (let w of [-1, 1])
            vertices4D.push([x, y, z, w]);

    // Edges differ by exactly one coordinate
    const edges: [number, number][] = [];
    for (let i = 0; i < vertices4D.length; i++) {
      for (let j = i + 1; j < vertices4D.length; j++) {
        let diff = 0;
        for (let k = 0; k < 4; k++) {
          if (vertices4D[i][k] !== vertices4D[j][k]) diff++;
        }
        if (diff === 1) edges.push([i, j]);
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const size = 30;

      const c = Math.cos(theta);
      const s = Math.sin(theta);

      const projected = vertices4D.map(([x, y, z, w]) => {
        // --- Isoclinic 4D rotation ---
        const x1 = x * c - w * s;
        const w1 = x * s + w * c;

        const y1 = y * c - z * s;
        const z1 = y * s + z * c;

        // --- 4D → 3D projection ---
        const d4 = 3;
        const scale4 = d4 / (d4 + w1);

        const x3 = x1 * scale4;
        const y3 = y1 * scale4;
        const z3 = z1 * scale4;

        // --- 3D → 2D projection ---
        const d3 = 5;
        const scale3 = d3 / (d3 + z3);

        return [
          cx + x3 * size * scale3,
          cy + y3 * size * scale3,
        ];
      });

      ctx.strokeStyle = '#2d2d2d';
      ctx.lineWidth = 3;

      edges.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(projected[a][0], projected[a][1]);
        ctx.lineTo(projected[b][0], projected[b][1]);
        ctx.stroke();
      });

      theta += 0.01;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationId !== null) cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} width={200} height={200} />;
};

export default SimpleTesseract;
