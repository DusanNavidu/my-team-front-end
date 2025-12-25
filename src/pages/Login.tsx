import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/authContext"
import { login, getMyDetails } from "../service/auth"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { showAlert } from "../components/Swail";

export default function Login() {
  const [username, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault() 

    if (!username.trim() || !password.trim()) {
      setErrorMessage("Please enter both email and password.");
      return
    }

    try {
      const data: any = await login(username, password)

      if (data?.status === 403 || data?.message === "User is not active") {
        showAlert({
          icon: "error",
          title: "Account Deactivated",
          text: "Your account has been deactivated. Please contact support.",
        });
        setErrorMessage("Login failed: your account is deactivated.");
        return;
      }

      if (data?.data?.accessToken) {
        await localStorage.setItem("accessToken", data.data.accessToken)
        await localStorage.setItem("refreshToken", data.data.refreshToken)

        const resData = await getMyDetails()
        setUser(resData.data)

        const roles: string[] = resData.data.roles || [];

        if (roles.includes("ADMIN")) {
          navigate("/admin/dashboard");
        } else if (roles.includes("ORGANIZER") || roles.includes("PLAYER") || roles.includes("USER")) {
          navigate("/home");
        } else {
          showAlert({
            icon: "error",
            title: "Login failed",
            text: "Please check your credentials and try again.",
          });
          setErrorMessage("Login failed, invalid user role.")
        }
      } else {
        showAlert({
          icon: "error",
          title: "Login failed",
          text: "Please check your credentials and try again.",
        });
        setErrorMessage("Login failed, please check your credentials.")
      }
    } catch (err: any) {
      console.error("Login error:", err)
      
      if (err.response?.status === 403) {
        showAlert({
          icon: "error",
          title: "Account Deactivated",
          text: "Your account has been deactivated. Please contact support.",
        });
        setErrorMessage("Login failed: your account is deactivated.");
      } else if (err.response?.status === 401) {
        showAlert({
          icon: "error",
          title: "Login failed",
          text: "Invalid email or password. Please try again.",
        });
        setErrorMessage("Login failed: invalid credentials.");
      } else {
        showAlert({
          icon: "error",
          title: "Login failed",
          text: "An unexpected error occurred. Please try again.",
        });
        setErrorMessage("An error occurred during login. Please try again.");
      }
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  return (
    <div className="">
      <img src="src/assets/image/american-football-player-wearing-equipment.jpg" alt="" 
        className="w-screen h-screen object-cover transform scale-x-[-1]"/>
      
      <h1 className="
            text-center text-7xl font-extrabold absolute top-[150px] left-3/4 transform -translate-x-1/2 -translate-y-1/2
            animate-float 
            bg-gradient-to-r from-blue-600 via-white to-blue-600 
            bg-clip-text text-transparent
            drop-shadow-lg text-shadow-lg
          ">
          MY TEAM
      </h1>

      <form className="absolute top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2
        w-2xl bg-blue-50/50 p-8 rounded-lg shadow-lg
        flex flex-col">
        
        <h3 className="text-center font-semibold">Welcome back to my team!</h3>
        <h2 className="text-4xl font-bold mb-6 text-center ">Login</h2>

        <label htmlFor="email">Email:</label>
        <input
          type="text"
          placeholder="example@gmail.com"
          value={username}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border border-black-300 rounded mb-4"
        />

        <label htmlFor="password">Password:</label>
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border border-black-300 rounded pr-10 w-full"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-black-600"
          >
            {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
          </button>
        </div>

        <p className="text-right text-blue-700 italic hover:underline cursor-pointer mb-4">forgot password</p>

        <div className="flex justify-center">
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition w-9/10">
            Login
          </button>
        </div>
        
        <small id="messages" className="text-center text-red-700 font-medium my-2">{errorMessage}</small>
        <p className="text-center mb-6">Don't have an account? <a href="/register" className="text-blue-700 font-bold italic hover:underline">Register?</a></p>

        <hr className="border-amber-50"/>

        <p className="text-center mb-6">or</p>

        <div className="flex justify-center">
          <button className="bg-black text-white p-2 w-9/10 flex gap-5 justify-center rounded hover:bg-gray-900 transition">
          <img className="w-[30px]" src="src/assets/image/google-color.png" alt="" />
          Continue with Google</button>
        </div>

      </form>
    </div>
  )
}
