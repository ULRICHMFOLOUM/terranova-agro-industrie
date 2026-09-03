"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sand-50 text-clay-900 p-8">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg border border-sand-200 p-8 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-clay-900">Une erreur est survenue</h1>
        <p className="text-sm text-sand-600">
          Le serveur a rencontré un problème lors du chargement de la page.
        </p>
        {error?.digest && (
          <p className="text-xs font-mono bg-sand-100 rounded px-3 py-2 text-sand-700">
            Digest: {error.digest}
          </p>
        )}
        {error?.message && (
          <p className="text-xs font-mono bg-red-50 rounded px-3 py-2 text-red-700 text-left break-all">
            {error.message}
          </p>
        )}
        <button
          onClick={reset}
          className="mt-4 px-6 py-2.5 bg-clay-900 hover:bg-terracotta-600 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
