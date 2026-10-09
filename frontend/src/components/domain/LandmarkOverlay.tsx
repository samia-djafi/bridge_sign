import React, { useRef, useEffect } from 'react';
import { NormalizedLandmark } from '@/types/domain';

// Standard 21 Hand Connections
const HAND_CONNECTIONS = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle
  [0, 9], [9, 10], [10, 11], [11, 12],
  // Ring
  [0, 13], [13, 14], [14, 15], [15, 16],
  // Pinky
  [0, 17], [17, 18], [18, 19], [19, 20],
  // Palm base
  [5, 9], [9, 13], [13, 17],
];

export interface LandmarkOverlayProps {
  hands?: NormalizedLandmark[][];
  pose?: NormalizedLandmark[];
  showTracking: boolean;
  mirror?: boolean;
  className?: string;
}

export const LandmarkOverlay: React.FC<LandmarkOverlayProps> = ({
  hands = [],
  pose = [],
  showTracking,
  mirror = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    if (!showTracking) return;

    ctx.save();
    if (mirror) {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }

    // 1. Draw Upper-body Pose
    if (pose.length >= 4) {
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.5)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      // Shoulders line
      if (pose[0] && pose[1]) {
        ctx.moveTo(pose[0].x * w, pose[0].y * h);
        ctx.lineTo(pose[1].x * w, pose[1].y * h);
      }
      ctx.stroke();

      for (const pt of pose) {
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#0F766E';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pt.x * w, pt.y * h, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }

    // 2. Draw Hand Landmarks & Connections
    hands.forEach((hand, handIdx) => {
      // Draw lines
      ctx.strokeStyle = '#2DD4BF';
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (const [startIdx, endIdx] of HAND_CONNECTIONS) {
        const start = hand[startIdx!];
        const end = hand[endIdx!];
        if (start && end) {
          ctx.moveTo(start.x * w, start.y * h);
          ctx.lineTo(end.x * w, end.y * h);
        }
      }
      ctx.stroke();

      // Draw 21 points
      hand.forEach((pt) => {
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#0F766E';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(pt.x * w, pt.y * h, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // Label chip (L / R)
      const wrist = hand[0];
      if (wrist) {
        ctx.save();
        if (mirror) {
          ctx.scale(-1, 1);
          ctx.translate(-w, 0);
        }
        const labelX = mirror ? (1 - wrist.x) * w : wrist.x * w;
        const labelY = wrist.y * h + 20;

        ctx.fillStyle = '#0F766E';
        ctx.fillRect(labelX - 12, labelY - 10, 24, 16);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(handIdx === 0 ? 'L' : 'R', labelX, labelY + 2);
        ctx.restore();
      }
    });

    ctx.restore();
  }, [hands, pose, showTracking, mirror]);

  return (
    <canvas
      ref={canvasRef}
      width={640}
      height={360}
      className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-150 ${
        showTracking ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    />
  );
};
