import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Modal from "../Modal/Modal";
import { changeUserRoleToPlayer } from "../../service/auth";
import { showAlert } from "../../components/Swail";
import user from "../../assets/image/9131478.png";

export default function Header() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);

  const openPlayerAgreementModal = () => {
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  const handleAgreementSubmit = async () => {
    if (!hasAgreed || !user) return;

    try {
      const res = await changeUserRoleToPlayer(user.id);

      localStorage.setItem("accessToken", res.data.accessToken);

      setUser(res.data.user);

      setIsModalOpen(false);
      setHasAgreed(false);
      navigate("/profile-player");

      showAlert({
        icon: "success",
        title: "Role Updated",
        text: "You have successfully agreed to the terms and your role has been updated to Player.",
      });
    } catch (error) {
      console.error("Role update failed", error);
      showAlert({
        icon: "error",
        title: "Role Update Failed",
        text: "There was an error updating your role. Please try again later.",
      });
    }
  };

  const hasRole = (role: string) => {
    return user?.roles?.includes(role) || false;
  };

  const isPlayer = hasRole("PLAYER");
  const isOrganizer = hasRole("ORGANIZER");
  const isUser = hasRole("USER");

  const hideTopButtons = location.pathname === "/organizer-register" || location.pathname === "/player-register";
  const userIsLoggedIn = !!user;

  const showCreatePlayer =
    userIsLoggedIn && !hideTopButtons && !isPlayer && isUser;
  const showCreateOrganizer =
    userIsLoggedIn && !hideTopButtons && !isOrganizer && isUser;
  const showJoinTeam =
    userIsLoggedIn && !hideTopButtons && !isPlayer && !isOrganizer && isUser;

  return (
    <header className="w-full h-[150px] bg-gray-900 fixed top-0 left-0 z-50 p-4 shadow-md flex">
      <div className="flex flex-col space-y-2 container mx-auto">
        <div className="flex space-x-4 justify-between items-center h-auto">
          <h1 className="text-3xl lg:text-5xl font-extrabold w-[150px] lg:w-[250px] animate-float bg-gradient-to-r from-blue-600 via-white to-blue-600 bg-clip-text text-transparent drop-shadow-lg text-shadow-lg">
            MY TEAM
          </h1>

          <button
            className="lg:hidden text-white z-50 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          <div className="hidden lg:flex space-x-4 items-center">
            {showCreatePlayer && (
              <button className="font-bold p-2 border-e-2 pr-8 text-amber-50"
                onClick={() => openPlayerAgreementModal()}>
                <p className="hover:text-blue-400">Create Player Account</p>
              </button>
            )}

            {showCreateOrganizer && (
              <Link to="/organizer-register" className="text-amber-50">
                <button className="font-bold p-2 border-e-2 pr-8">
                  <p className="hover:text-blue-400">
                    Create Organizer Account
                  </p>
                </button>
              </Link>
            )}

            {showJoinTeam && (
              <Link to="/" className="text-amber-50">
                <button className="font-bold p-2">
                  <p className="hover:text-blue-400">Join Team</p>
                </button>
              </Link>
            )}

            {userIsLoggedIn ? (
              <Link to="/" className="text-amber-50">
                <button
                  onClick={handleLogout}
                  className="border border-red-600 hover:bg-red-600 hover:text-white hover:rounded-3xl transition-all duration-500 text-red-600 font-bold py-2 px-4 rounded"
                >
                  Logout
                </button>
              </Link>
            ) : (
              <Link to="/login" className="text-amber-50">
                <button className="border border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 text-blue-600 font-bold py-2 px-4 rounded">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>

        <div className="flex space-x-4 mt-6 text-lg font-medium justify-between">
          <div className="hidden lg:flex gap-10 overflow-x-auto pb-1 whitespace-nowrap">
            {!hideTopButtons && (
              <Link
                to="/home"
                className="hover:underline hover:underline-offset-4 hover:decoration-2 transition-all duration-500 text-amber-50"
              >
                Home
              </Link>
            )}
            {!hideTopButtons && (
              <Link
                to="/event"
                className="hover:underline hover:underline-offset-4 hover:decoration-2 transition-all duration-500 text-amber-50"
              >
                Events
              </Link>
            )}
            {!hideTopButtons && (
              <Link
                to="/live-scores"
                className="hover:underline hover:underline-offset-4 hover:decoration-2 transition-all duration-500 text-amber-50"
              >
                Live Scores
              </Link>
            )}
            {!hideTopButtons && (
              <Link
                to="/news"
                className="hover:underline hover:underline-offset-4 hover:decoration-2 transition-all duration-500 text-amber-50"
              >
                News
              </Link>
            )}
            {!hideTopButtons && !isOrganizer && (
              <Link
                to="/team"
                className="hover:underline hover:underline-offset-4 hover:decoration-2 transition-all duration-500 text-amber-50"
              >
                Team
              </Link>
            )}
            {!hideTopButtons && isOrganizer &&(
              <Link
                to="/profile-organizer"
                className="hover:underline hover:underline-offset-4 hover:decoration-2 transition-all duration-500 text-amber-50"
              >
                Profile
              </Link>
            )}
            {!hideTopButtons && isPlayer &&(
              <Link
                to="/profile-player"
                className="hover:underline hover:underline-offset-4 hover:decoration-2 transition-all duration-500 text-amber-50"
              >
                Profile
              </Link>
            )}
            {!hideTopButtons && (
              <Link
                to="/contact"
                className="hover:underline hover:underline-offset-4 hover:decoration-2 transition-all duration-500 text-amber-50"
              >
                Contact Us
              </Link>
            )}
          </div>

          <div className="hidden lg:flex space-x-2 items-center min-w-max">
            {user ? (
              <p className="text-white">Hello, {user.fullname || "Guest"}</p>
            ) : null}
            <img
              className="w-[30px] border rounded-4xl border-amber-50"
              src={user}
              alt="User Avatar"
            />
          </div>
        </div>
      </div>

      <div
        className={`
                lg:hidden fixed top-[75px] left-0 w-full h-full bg-gray-900/95 backdrop-blur-sm z-30 transform transition-transform duration-300 ease-in-out
                ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
            `}
      >
        
        <div className="flex flex-col space-y-6 p-8 text-xl font-medium">
          <div className="flex flex-col space-y-4 border-b border-gray-700 pb-4">
            {!hideTopButtons && (
              <Link
                to="/home"
                className="text-amber-50 hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            )}
            {!hideTopButtons && (
              <Link
                to="/event"
                className="text-amber-50 hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link>
            )}
            {!hideTopButtons && (
              <Link
                to="/live-scores"
                className="text-amber-50 hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Live Scores
              </Link>
            )}
            {!hideTopButtons && (
              <Link
                to="/news"
                className="text-amber-50 hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                News
              </Link>
            )}
            {!hideTopButtons && (
              <Link
                to="/team"
                className="text-amber-50 hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Team
              </Link>
            )}
            {!hideTopButtons && isOrganizer &&(
              <Link
                to="/profile-organizer"
                className="text-amber-50 hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
            )}
            {!hideTopButtons && isPlayer &&(
              <Link
                to="/profile-player"
                className="text-amber-50 hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
            )}
            {!hideTopButtons && (
              <Link
                to="/contact"
                className="text-amber-50 hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
            )}
          </div>

          <div className="pt-4 space-y-4">
            {showCreatePlayer && (
              <button className="text-blue-400 block hover:text-blue-600" 
                onClick={() => {
                  setIsMenuOpen(false);
                  openPlayerAgreementModal();
                }}>
                Create Player Account
              </button>
            )}
            {showCreateOrganizer && (
              <Link
                to="/organizer-register"
                className="text-blue-400 block hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Create Organizer Account
              </Link>
            )}
            {showJoinTeam && (
              <Link
                to="/"
                className="text-blue-400 block hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Join Team
              </Link>
            )}

            {userIsLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full text-left text-red-500 hover:text-red-700 pt-4 border-t border-gray-700"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="text-blue-500 block pt-4 border-t border-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {userIsLoggedIn && (
        <div className="lg:hidden absolute top-4 right-14 flex space-x-2 items-center min-w-max mt-[90px]">
          <p className="text-white text-sm sm:block">
            Hello, {user.fullname || "Guest"}
          </p>
          <img
            className="w-[30px] border rounded-4xl border-amber-50"
            src="src/assets/image/9131478.png"
            alt="User Avatar"
          />
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6 max-w-lg bg-white rounded-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
            Player Agreement & Terms
          </h1>

          <div className="bg-gray-50 p-4 rounded-xl mb-4 max-h-60 overflow-y-auto border border-gray-200">
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              Welcome to the platform! As a player, please review the following rules:
            </p>
            <ul className="list-disc ml-5 text-gray-600 text-xs space-y-2">
              <li><strong>Fair Play:</strong> No cheats or hacks.</li>
              <li><strong>Respect:</strong> Be kind to others.</li>
              <li><strong>Privacy:</strong> Data used for stats.</li>
              <li><strong>Participation:</strong> Don't miss matches.</li>
            </ul>
          </div>

          <label className="flex items-center gap-3 cursor-pointer mb-6">
            <input
              type="checkbox"
              className="w-5 h-5 accent-blue-600"
              checked={hasAgreed}
              onChange={() => setHasAgreed(!hasAgreed)}
            />
            <span className="text-gray-700 font-medium">
              I agree to the Player Agreement
            </span>
          </label>

          <div className="flex justify-end gap-3">
            <button 
              className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
              onClick={() => setIsModalOpen(false)}
            >
              Decline
            </button>
            <button 
              disabled={!hasAgreed}
              className={`px-4 py-2 rounded-md text-white transition-colors ${hasAgreed ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
              onClick={handleAgreementSubmit}
            >
              Confirm & Proceed
            </button>
          </div>
        </div>
      </Modal>
    </header>
  );
}
