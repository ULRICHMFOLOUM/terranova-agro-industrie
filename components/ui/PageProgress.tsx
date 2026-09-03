"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function PageProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setAnimating(true);
    const timer = setTimeout(() => {
      setAnimating(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {animating && (
        <motion.div
          key="page-progress-bar"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-terracotta-500 via-harvest-400 to-sage-400 z-[100] origin-left pointer-events-none"
        />
      )}
    </AnimatePresence>
  );
}
