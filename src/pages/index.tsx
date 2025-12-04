import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Index() {

  const images = [
    "src/assets/image/soccer-game-concept.jpg",
    "src/assets/image/cricket-match-with-player.jpg",
    "src/assets/image/cyclist-riding-bicycle-nature.jpg"
  ];

  const [current, setCurrent] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-[600px] h-[350px] overflow-hidden rounded-xl shadow-lg">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt=""
          className={`w-full h-full object-cover absolute transition-opacity duration-1000 ${
            current === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white p-4 justify-center flex flex-col">
        
        <h1
          className="
            text-center text-7xl font-extrabold 
            animate-float 
            bg-gradient-to-r from-blue-600 via-white to-blue-600 
            bg-clip-text text-transparent
            drop-shadow-lg text-shadow-lg
          "
        >
          MY TEAM
        </h1>

        <div className="flex justify-center mt-4">
          <Link to="/login">
            <button className="m-4 rounded-2xl w-60 h-20 text-2xl px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 border-2">
              Get Started
            </button>
          </Link>
          <Link to="/register" className="ml-4">
            <button className="m-4 rounded-2xl w-60 h-20 text-2xl px-4 py-2 bg-green-500 text-white hover:bg-green-600 border-2">
              Register
            </button>
          </Link>
        </div>
        <p className="text-center lg:text-lg">
          "My Team" is the definitive digital hub for the sports enthusiast. Get
          real-time live scores and schedules for all major global events.
          Access in-depth player profiles, including career stats and status
          updates. With instant, personalized notifications and a curated feed
          of breaking news and analysis, "My Team" ensures you are always
          connected to the world of sports.
        </p>
      </div>
    </div>
  );
}