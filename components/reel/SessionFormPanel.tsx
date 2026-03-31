"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { X, Loader2 } from "lucide-react";

interface FilmItem {
  id: string;
  title: string;
  posterPath: string | null;
  sessionCount: number;
}

interface SessionFormPanelProps {
  film: FilmItem;
  onClose: () => void;
  onSuccess: (filmId: string) => void;
}

// Curated emoji palette for mood/感受
const EMOJI_OPTIONS = [
  "😭", "🥺", "😢", "🫠", "😤",
  "🤯", "😱", "🥲", "😍", "🫶",
  "🤔", "😶‍🌫️", "🌊", "🔥", "🌙",
  "🫧", "💫", "🖤", "🌸", "✨",
];

type AnimPhase = "idle" | "rolling" | "flying" | "absorbed" | "done";

export function SessionFormPanel({ film, onClose, onSuccess }: SessionFormPanelProps) {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [watchedAt, setWatchedAt] = useState(new Date().toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);
  const [animPhase, setAnimPhase] = useState<AnimPhase>("idle");
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const panelControls = useAnimation();
  const tokenControls = useAnimation();
  const panelRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      // Create watch session
      const sessionRes = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filmId: film.id,
          watchedAt: new Date(watchedAt).toISOString(),
          mood: selectedEmoji ?? undefined,
          notes: notes.trim() || undefined,
        }),
      });

      if (!sessionRes.ok) throw new Error("Failed to create session");

      // ── Phase 1: Roll up (0–350ms) ──
      setAnimPhase("rolling");
      await panelControls.start({
        scaleY: 0,
        scaleX: 0.85,
        rotateX: 15,
        opacity: 0.6,
        transition: {
          duration: 0.35,
          ease: [0.4, 0, 0.2, 1],
        },
      });

      // ── Phase 2 → 3: Fly as token (350–800ms) ──
      setAnimPhase("flying");
      await tokenControls.start({
        opacity: [0, 1],
        scale: [0.3, 1],
        transition: { duration: 0.15 },
      });
      await tokenControls.start({
        y: -220,
        x: 0,
        scale: 0.3,
        opacity: 0,
        transition: {
          duration: 0.45,
          ease: [0.4, 0, 1, 1],
        },
      });

      // ── Phase 4: Absorbed + feedback ──
      setAnimPhase("absorbed");
      setFeedbackVisible(true);

      await new Promise((r) => setTimeout(r, 1200));

      setFeedbackVisible(false);
      setAnimPhase("done");

      onSuccess(film.id);
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      setAnimPhase("idle");
      await panelControls.start({ scaleY: 1, scaleX: 1, rotateX: 0, opacity: 1 });
    }
  }

  const isRolling = animPhase === "rolling" || animPhase === "flying";

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 80 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-center pb-safe"
    >
      {/* Feedback text */}
      <AnimatePresence>
        {feedbackVisible && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 text-white/80 text-sm font-light tracking-widest"
          >
            期待你下一次的感受
          </motion.p>
        )}
      </AnimatePresence>

      {/* Flying token */}
      <AnimatePresence>
        {animPhase === "flying" && (
          <motion.div
            animate={tokenControls}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 w-14 h-10 rounded-md bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center text-xl pointer-events-none"
          >
            🎞️
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form panel */}
      <motion.div
        ref={panelRef}
        animate={panelControls}
        style={{ transformOrigin: "bottom center" }}
        className="w-full max-w-lg mx-auto"
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white/8 backdrop-blur-2xl border border-white/15 rounded-t-3xl px-6 pt-5 pb-8 shadow-2xl"
        >
          {/* Handle bar */}
          <div className="flex items-center justify-between mb-5">
            <div className="w-10 h-1 rounded-full bg-white/20 mx-auto" />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-5 p-1.5 rounded-full bg-white/10 text-white/50 hover:text-white/80 hover:bg-white/15 transition-all"
            >
              <X size={14} />
            </button>
          </div>

          {/* Film name */}
          <p className="text-white/50 text-xs uppercase tracking-widest mb-1">正在记录</p>
          <p className="text-white text-base font-semibold mb-5 truncate">{film.title}</p>

          {/* Emoji mood selector */}
          <div className="mb-5">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-2.5">此刻的感受</p>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(selectedEmoji === emoji ? null : emoji)}
                  className={`text-xl w-10 h-10 rounded-xl transition-all ${
                    selectedEmoji === emoji
                      ? "bg-white/25 ring-2 ring-white/50 scale-110"
                      : "bg-white/8 hover:bg-white/15"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="mb-5">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-2">观看日期</p>
            <input
              type="date"
              value={watchedAt}
              onChange={(e) => setWatchedAt(e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
              className="bg-white/8 border border-white/15 rounded-xl px-4 py-2.5 text-white/80 text-sm outline-none focus:ring-1 focus:ring-white/30 [color-scheme:dark]"
            />
          </div>

          {/* Notes */}
          <div className="mb-6">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-2">感悟（可选）</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="写下此刻..."
              rows={3}
              className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-white/80 placeholder:text-white/25 text-sm outline-none focus:ring-1 focus:ring-white/30 resize-none leading-relaxed"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-2xl bg-white text-gray-900 text-sm font-bold tracking-wide hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                记录中...
              </span>
            ) : (
              "完成记录"
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
