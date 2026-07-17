"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ConfettiProps {
  active: boolean;
}

export function Confetti({ active }: ConfettiProps) {
  const [pieces, setPieces] = useState<
    { id: number; left: number; delay: number; color: string }[]
  >([]);

  useEffect(() => {
    if (!active) return;
    setPieces(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: ["#6c5ce7", "#00b894", "#fdcb6e", "#e17055"][i % 4],
      })),
    );
  }, [active]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ y: "100vh", opacity: 0, rotate: 360 }}
          transition={{ duration: 2.5, delay: piece.delay, ease: "easeIn" }}
          className="absolute h-3 w-2 rounded-sm"
          style={{ left: `${piece.left}%`, backgroundColor: piece.color }}
        />
      ))}
    </div>
  );
}
