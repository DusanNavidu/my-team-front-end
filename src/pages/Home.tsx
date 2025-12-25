import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import EventBox from "../components/post/Post";

export default function Home() {

    const { user, setUser } = useAuth()
  
  const hasRole = (role: string) => {
      return user?.roles?.includes(role) || false;
  };

  const isPlayer = hasRole('PLAYER');
  const isOrganizer = hasRole('ORGANIZER');
  const isUser = hasRole('USER');

  const userIsLoggedIn = !!user;

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
      <div className="relative w-full h-[80vh] min-h-[700px] overflow-hidden">
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
          {userIsLoggedIn && !isOrganizer && (
            <div className="mt-6">
              <button className="bg-orange-400 text-amber-50 font-semibold p-4 rounded transition-all duration-200 hover:rounded-3xl">
                Create Team +
              </button>
              <button className="ml-4 bg-blue-600 text-amber-50 font-semibold p-4 rounded transition-all duration-200 hover:rounded-3xl">
                Share Your Ideas 
              </button>
            </div>
          )}
          {userIsLoggedIn && !isPlayer && !isUser && (
            <div className="mt-6">
              <button className="bg-orange-400 text-amber-50 font-semibold p-4 rounded transition-all duration-200 hover:rounded-3xl">
                Create Event +
              </button>
              <button className="ml-4 bg-blue-600 text-amber-50 font-semibold p-4 rounded transition-all duration-200 hover:rounded-3xl">
                Share Your Ideas 
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto mt-12">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
            Events
          </h2>
          <div className="flex justify-end">
            <p className="text-blue-500 font-semibold cursor-pointer hover:underline hover:text-blue-600">Show all</p>
          </div>
          <EventBox />
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
            News
          </h2>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
            Players
          </h2>
        </div>

          <div className="mt-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
            Committees
          </h2>
        </div>
      </div>
    </div>
  );
}