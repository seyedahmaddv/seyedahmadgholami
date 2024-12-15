"use client"
export default function HomeComponents() {
    return (
        <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center">
            {/* عنوان */}
            <h1
                id="title"
                className="inline-flex flex-col gap-1 transition font-display text-6xl font-bold leading-none md:text-[8rem] bg-gradient-to-r from-20% bg-clip-text text-transparent from-emerald-400 to-yellow-300"
            >
                <span>Seyed Ahmad</span><span>Gholami</span>
            </h1>
            <p className="text-xl md:text-2xl">
          A Modern Blog Platform to Share Posts
        </p>

            {/* کادرهای اصلی */}
            <div className="mt-8 grid gap-2 md:mt-16 md:grid-cols-3">
                {/* کادر اول */}
                <div
                    className="group relative flex flex-col cursor-pointer	w-80 items-center p-6 md:p-8  bg-white/5 backdrop-blur transition duration-300 rounded-lg rounded-l-3xl xl:first:!rounded-l-4xl xl:last:!rounded-r-4xl hover:scale-[1.02] hover:bg-white/10"
                    onMouseEnter={() => changeTitleColor("from-red-500", "to-yellow-500")}
                    onMouseLeave={() =>
                        resetTitleColor("from-emerald-400", "to-yellow-300")
                    }
                >
                    <h2 className="text-xl font-bold mb-4">Redis</h2>
                    <p>Serverless database with Redis API</p>
                    <button className="mt-4 px-4 py-2 bg-white text-black rounded group-hover:bg-gradient-to-r from-red-500 to-yellow-500 transition duration-300">
                        Create Database
                    </button>
                </div>

                {/* کادر دوم */}
                <div
                    className="group relative flex flex-col cursor-pointer	w-80 items-center p-6 md:p-8 bg-white/5 backdrop-blur transition duration-300 rounded-lg xl:first:!rounded-l-4xl xl:last:!rounded-r-4xl hover:scale-[1.02] hover:bg-white/10"
                    onMouseEnter={() =>
                        changeTitleColor("from-purple-500", "to-indigo-500")
                    }
                    onMouseLeave={() =>
                        resetTitleColor("from-emerald-400", "to-yellow-300")
                    }
                >
                    <h2 className="text-xl font-bold mb-4">Vector</h2>
                    <p>Serverless Vector Database</p>
                    <button className="mt-4 px-4 py-2 bg-white text-black rounded group-hover:bg-gradient-to-r from-purple-500 to-indigo-500 transition duration-300">
                        Create Index
                    </button>
                </div>

                {/* کادر سوم */}
                <div
                    className="group relative flex flex-col cursor-pointer	w-80 items-center p-6 md:p-8 bg-white/5 backdrop-blur transition duration-300 rounded-lg rounded-r-3xl xl:first:!rounded-l-4xl xl:last:!rounded-r-4xl hover:scale-[1.02] hover:bg-white/10"
                    onMouseEnter={() => changeTitleColor("from-green-500", "to-teal-500")}
                    onMouseLeave={() =>
                        resetTitleColor("from-emerald-400", "to-yellow-300")
                    }
                >
                    <h2 className="text-xl font-bold mb-4">QStash</h2>
                    <p>Messaging for the Serverless</p>
                    <button
                        
                        className="mt-4 px-4 py-2 bg-white text-black rounded group-hover:bg-gradient-to-r from-green-500 to-teal-500 transition duration-300">
                        Publish Messages
                    </button>
                </div>
            </div>
        </main>
    );
}

// تغییر رنگ عنوان
function changeTitleColor(fromColor: string, toColor: string) {
    const title = document.getElementById("title");
    if (title) {
        title.classList.remove("from-emerald-400", "to-yellow-300");
        title.classList.add(fromColor, toColor);
    }
}

// بازنشانی رنگ عنوان
function resetTitleColor(fromColor: string, toColor: string) {
    const title = document.getElementById("title");
    if (title) {
        title.classList.remove("from-red-500", "to-yellow-500", "from-purple-500", "to-indigo-500", "from-green-500", "to-teal-500");
        title.classList.add(fromColor, toColor);
    }
}
