"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="grid min-h-[60dvh] place-items-center p-6 text-center">
      <div>
        <h1 className="font-display text-2xl font-bold">Thil a dik lo deuh</h1>
        <p className="mt-1 text-muted">Internet en la, tum leh rawh.</p>
        <button onClick={reset} className="mt-5 h-12 rounded-full bg-saffron px-6 font-bold text-black">Tum leh rawh</button>
      </div>
    </div>
  );
}
