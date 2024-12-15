import HomeComponents from "./HomeComponents/page";

export default function App() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      {/* Header */}
      <header className="text-center">
        <h1 className="inline-flex flex-col gap-1 transition font-display text-6xl font-bold leading-none md:text-[8rem] bg-gradient-to-r from-20% bg-clip-text text-transparent from-emerald-400 to-yellow-300">
          <span>Seyed Ahmad</span>
          <span>Gholami</span>
        </h1>
        <p className="text-xl md:text-2xl">
          A Modern Blog Platform to Share Posts
        </p>
      </header>

      {/* Action Buttons */}
      <div className="flex mt-8 gap-4">
        <a
          href="#create-post"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
        >
          Create Post
        </a>
        <a
          href="#read-posts"
          className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded"
        >
          View Posts
        </a>
      </div>
      <HomeComponents />
    </main>
  );
}
