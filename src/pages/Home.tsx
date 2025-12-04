import { useEffect, useState } from "react";

export default function Home() {

  const images = [
    "src/assets/image/soccer-players-action-professional-stadium.jpg",
    "src/assets/image/american-football-players-wearing-equipment.jpg",
    "src/assets/image/cricket-batsman.jpg",
    "src/assets/image/close-up-athlete-playing-soccer.jpg",
    "src/assets/image/345878.jpg",
    "src/assets/image/Gemini_Generated_Image_x66yoax66yoax66y.png",
    "src/assets/image/medium-shot-victorious-gamers-winning.jpg",
    "src/assets/image/safely-motorcycle-helmet.jpg"
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;

    const intervalId = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [images.length]);

  return (
    <div className="w-full">
      <div className="relative w-full h-[80vh] min-h-[500px] overflow-hidden">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Dynamic background image ${index + 1}`}
            className={`
              absolute top-[150px] inset-0 w-full h-full object-cover 
              transition-opacity duration-1000 z-0
              ${current === index ? "opacity-100" : "opacity-0"}
            `}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-2"></div>

        <div className="relative z-3 container mx-auto w-full h-full flex flex-col items-start justify-center text-center p-4">
          <h2 className="text-white text-start text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 drop-shadow-lg">
            BUILD YOUR FUTURE 
            <br />
            DREAM
          </h2>
          <p className="text-gray-200 font-semibold text-start lg:w-5/10 md:6/10 sm:8/10">
            A modern online platform where sports players and event organizers
            can connect effortlessly. Organizers can create and manage sporting
            events, players can discover and join matches, and users can easily
            search for upcoming activities. It’s the perfect space for bringing
            athletes, teams, and organizers together in one streamlined system,
            with the ability to build future plans, goals, and dreams for their
            sports journey.
          </p>
          <div className="mt-6">
            <button className="bg-orange-400 text-amber-50 font-semibold p-4 rounded transition-all duration-200 hover:rounded-3xl">
              Create Team +
            </button>
            <button className="ml-4 bg-blue-600 text-amber-50 font-semibold p-4 rounded transition-all duration-200 hover:rounded-3xl">
              Share Your Ideas 
            </button>
          </div>
        </div>
      </div>

      <div className="py-12 px-4 max-w-7xl mx-auto w-full">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-4">
            ⚽️ Latest Matches
          </h1>
          <p className="text-center text-gray-600">
            Check out the results and stats from our recent games.
          </p>
          <div className="mt-6 p-6 bg-blue-50 rounded-lg shadow">
            <p>Team A vs Team B: **3 - 1** (Win)</p>
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-4">
            👤 Player Spotlight
          </h1>
          <p className="text-center text-gray-600">
            Meet the top performers of the week.
          </p>
          <div className="mt-6 p-6 bg-green-50 rounded-lg shadow">
            <img
              src="/placeholder-player.jpg"
              alt="Player Spotlight"
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
            <p className="text-lg font-semibold text-green-700">
              John Doe - MVP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}