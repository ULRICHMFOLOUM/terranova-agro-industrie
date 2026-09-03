"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";

export function ConfettiTrigger() {
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#C26526", "#E6AF2E", "#8C9B78", "#1E281F"],
      });
    } catch {}
  }, []);

  return null;
}
