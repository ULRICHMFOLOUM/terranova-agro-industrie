"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InitialLoaderProps {
  onLoaded?: () => void;
  brandName?: string;
  tagline?: string;
}

export function InitialLoader({
  onLoaded,
  brandName = "TERRANOVA",
  tagline = "Excellence Agro-Pastorale & Précision Industrielle",
}: InitialLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Vérifier les préférences d'animation de l'utilisateur
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    if (mediaQuery.matches) {
      setIsDone(true);
      onLoaded?.();
      return;
    }

    // Incrémenter la progression en fonction du chargement réel
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDone(true);
            onLoaded?.();
          }, 350);
          return 100;
        }
        const step = Math.floor(Math.random() * 12) + 4;
        return Math.min(prev + step, 100);
      });
    }, 45);

    const handleWindowLoad = () => {
      setProgress(100);
    };

    if (document.readyState === "complete") {
      // document already ready
    } else {
      window.addEventListener("load", handleWindowLoad);
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener("load", handleWindowLoad);
    };
  }, [onLoaded]);

  if (isDone && progress >= 100) {
    return null;
  }

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="initial-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-clay-950 text-sand-50"
          style={{ backgroundColor: "#0E140F" }}
        >
          {/* Subtle background radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-clay-800/40 via-clay-950/80 to-clay-950 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center">
            {/* Animated SVG Brand Monogram */}
            <div className="relative w-28 h-28 mb-8">
              <svg viewBox="0 0 512 512" className="w-full h-full drop-shadow-[0_0_25px_rgba(230,175,46,0.35)]">
                {/* Outer Ring */}
                <circle
                  cx="256"
                  cy="256"
                  r="220"
                  fill="none"
                  stroke="#2A3A2C"
                  strokeWidth="6"
                />
                <motion.circle
                  cx="256"
                  cy="256"
                  r="220"
                  fill="none"
                  stroke="url(#loaderGold)"
                  strokeWidth="6"
                  strokeDasharray="1382"
                  initial={{ strokeDashoffset: 1382 }}
                  animate={{ strokeDashoffset: 1382 - (1382 * progress) / 100 }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />

                {/* Stalk & Horizon Line */}
                <motion.path
                  d="M 256 380 L 256 140"
                  stroke="url(#loaderGold)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: Math.min(progress / 70, 1) }}
                  transition={{ duration: 0.4 }}
                />
                <motion.path
                  d="M 170 160 L 342 160"
                  stroke="url(#loaderGold)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: Math.min(progress / 50, 1) }}
                  transition={{ duration: 0.4 }}
                />

                {/* Grains */}
                <motion.circle
                  cx="210"
                  cy="220"
                  r="14"
                  fill="#E6AF2E"
                  initial={{ scale: 0 }}
                  animate={{ scale: progress > 30 ? 1 : 0 }}
                />
                <motion.circle
                  cx="302"
                  cy="220"
                  r="14"
                  fill="#E6AF2E"
                  initial={{ scale: 0 }}
                  animate={{ scale: progress > 45 ? 1 : 0 }}
                />
                <motion.circle
                  cx="210"
                  cy="270"
                  r="14"
                  fill="#E6AF2E"
                  initial={{ scale: 0 }}
                  animate={{ scale: progress > 60 ? 1 : 0 }}
                />
                <motion.circle
                  cx="302"
                  cy="270"
                  r="14"
                  fill="#E6AF2E"
                  initial={{ scale: 0 }}
                  animate={{ scale: progress > 75 ? 1 : 0 }}
                />
                <motion.circle
                  cx="256"
                  cy="325"
                  r="10"
                  fill="#C26526"
                  initial={{ scale: 0 }}
                  animate={{ scale: progress > 85 ? 1 : 0 }}
                />

                <defs>
                  <linearGradient id="loaderGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FCE29A" />
                    <stop offset="50%" stopColor="#E6AF2E" />
                    <stop offset="100%" stopColor="#B88310" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Typography */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl font-serif font-bold tracking-[0.25em] text-harvest-300 uppercase mb-2"
            >
              {brandName}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              className="text-xs sm:text-sm font-sans tracking-widest text-sand-300 uppercase mb-8"
            >
              {tagline}
            </motion.p>

            {/* Progress Bar & Percentage */}
            <div className="w-48 sm:w-64 bg-clay-800 rounded-full h-1.5 overflow-hidden p-0.5 border border-clay-700/50">
              <motion.div
                className="h-full bg-gradient-to-r from-terracotta-500 via-harvest-400 to-terracotta-400 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            <div className="mt-3 font-mono text-xs text-harvest-400/90 tracking-widest">
              {progress}%
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
