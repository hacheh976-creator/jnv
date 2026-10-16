import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center p-6 text-center">
      <div>
        <p className="font-display text-7xl font-extrabold text-saffron">404</p>
        <h1 className="mt-2 font-display text-2xl font-bold">Kan hmu lo</h1>
        <p className="mt-1 text-muted">I zawn hi a awm lo emaw paih a ni tawh.</p>
        <Link href="/" className="mt-6 inline-flex h-12 items-center rounded-full bg-saffron px-6 font-bold text-black">Home-ah kir leh rawh</Link>
      </div>
    </main>
  );
}
