import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/authContext"

export default function Header() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    navigate("/login")
  }

  const hasRole = (role: string) => {
      return user?.roles?.includes(role) || false;
  };

  const isPlayer = hasRole('PLAYER');
  const isOrganizer = hasRole('ORGANIZER');

  const hideTopButtons = location.pathname === "/organizer-register";
  const userIsLoggedIn = !!user;

  return (
    <header className="w-full h-[150px] bg-gray-900 fixed top-0 left-0 z-4 p-4 shadow-md flex">

      <div className="flex flex-col space-y-2 container mx-auto">
        
        <div className="flex space-x-4 justify-between items-center">
          
          <h1 className="text-5xl font-extrabold w-[250px] animate-float bg-gradient-to-r from-blue-600 via-white to-blue-600 bg-clip-text text-transparent drop-shadow-lg text-shadow-lg">MY TEAM</h1>
          
          <div className="flex space-x-4 items-center">
            {userIsLoggedIn && !hideTopButtons && !isPlayer && !isOrganizer && (
              <>
                <Link to="/" className="text-amber-50">
                  <button className="font-bold p-2 border-e-2 pr-8">
                    <p className="hover:text-blue-400">Create Player Account</p>
                  </button>
                </Link>
              </>
            )}
            
            {(userIsLoggedIn && !hideTopButtons && !isPlayer && !isOrganizer) && (
              <>
                <Link to="/organizer-register" className="text-amber-50">
                  <button className="font-bold p-2 border-e-2 pr-8">
                    <p className="hover:text-blue-400">Create Organizer Account</p>
                  </button>
                </Link>
              </>
            )}
            

            {(userIsLoggedIn && !hideTopButtons && !isPlayer && !isOrganizer) && (
              <>
                <Link to="/" className="text-amber-50">
                  <button className="font-bold p-2">
                    <p className="hover:text-blue-400">Join Team</p>
                  </button>
                </Link>
              </>
            )}
            
            <Link to="/" className="text-amber-50">
              <button onClick={handleLogout} className="border border-red-600 hover:bg-red-600 hover:text-white hover:rounded-3xl transition-all duration-500 text-red-600 font-bold py-2 px-4 rounded">
                Logout
              </button>
            </Link>
          </div>
        </div>
        
        <div className="flex space-x-4 mt-6 text-lg font-medium justify-between">
          <div className="flex gap-10">
            {!hideTopButtons && (
              <Link to="/home" className="hover:underline hover:underline-offset-4 hover:decoration-2 transition-all duration-500 text-amber-50">
                Home
              </Link>
            )}

            {!hideTopButtons && (
              <Link to="/event" className="hover:underline hover:underline-offset-4 hover:decoration-2 transition-all duration-500 text-amber-50">
                Events
              </Link>
            )}

            {!hideTopButtons && (
              <Link to="/live-scores" className="hover:underline hover:underline-offset-4 hover:decoration-2 transition-all duration-500 text-amber-50">
                Live Scores
              </Link>
            )}

            {!hideTopButtons && (
              <Link to="/news" className="hover:underline hover:underline-offset-4 hover:decoration-2 transition-all duration-500 text-amber-50">
                News
              </Link>
            )}

            {!hideTopButtons && (
              <Link to="/team" className="hover:underline hover:underline-offset-4 hover:decoration-2 transition-all duration-500 text-amber-50">
                Team
              </Link>
            )}

            {!hideTopButtons && (
              <Link to="/profile" className="hover:underline hover:underline-offset-4 hover:decoration-2 transition-all duration-500 text-amber-50">
                Profile
              </Link>
            )}

            {!hideTopButtons && (
              <Link to="/contact" className="hover:underline hover:underline-offset-4 hover:decoration-2 transition-all duration-500 text-amber-50">
                Contact Us
              </Link>
            )}
          </div>
          <div className="flex space-x-2">
            {user ? (
              <p className="text-white ">
                Hello, {user.fullname || 'Guest'}
              </p>
            ) : (null
            )}
            <img className="w-[30px] border rounded-4xl border-amber-50" src="src/assets/image/9131478.png" alt="" />
          </div>
        </div>
      </div>
    </header>
  )
}