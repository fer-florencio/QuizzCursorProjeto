"use client";

import { DEFAULT_PLAYER_NAME } from "@/lib/config";

interface PlayerNameInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function PlayerNameInput({ value, onChange }: PlayerNameInputProps) {
  return (
    <div className="w-full max-w-md">
      <label
        htmlFor="player-name"
        className="mb-2 block text-sm font-medium text-white/70"
      >
        Seu nome (opcional)
      </label>
      <input
        id="player-name"
        type="text"
        maxLength={50}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={DEFAULT_PLAYER_NAME}
        className="w-full rounded-xl border border-white/10 bg-background px-4 py-3 text-white placeholder:text-white/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
}
