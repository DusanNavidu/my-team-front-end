import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { register } from "../service/auth"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullname, setFullname] = useState("")

  const [showPassword1, setShowPassword1] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)

  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()

    try {
      const data: any = await register(fullname, email, confirmPassword)

      alert(`Registration successful! Email: ${data.data.email}`)

      navigate("/login")
    } catch (err: any) {
      console.error("Registration error:", err)
      alert("Registration failed. Please try again.")
    }
  }

  const togglePasswordVisibility1 = () => {
    setShowPassword1(!showPassword1);
  }

   const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  }

  return (
    <div className="">
      <img src="src/assets/image/american-football-player-wearing-equipment.jpg" alt="" 
          className="w-screen h-screen object-cover"/>

      <h1 className="
            text-center text-7xl font-extrabold absolute top-[100px] left-1/4 transform -translate-x-1/2 -translate-y-1/2
            animate-float 
            bg-gradient-to-r from-blue-600 via-white to-blue-600 
            bg-clip-text text-transparent
            drop-shadow-lg text-shadow-lg
          ">
          MY TEAM
      </h1>
    
      <form className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2
        w-2xl bg-blue-50/50 p-8 rounded-lg shadow-lg
        flex flex-col">
        
        <h3 className="text-center font-semibold">Welcome back to my team!</h3>
        <h2 className="text-4xl font-bold mb-6 text-center ">Login</h2>

        <label htmlFor="name">Full Name:</label>
        <input 
          type="text" 
          placeholder="John Mark"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          className="p-2 border border-black-300 rounded mb-4"/>

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border border-black-300 rounded mb-4"
        />

        <label htmlFor="password">Password:</label>
        <div className="relative mb-4">
          <input
            type={showPassword1 ? "text" : "password"}
            id="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border border-black-300 rounded pr-10 w-full"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility1}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-black-600"
          >
            {showPassword1 ? <FaRegEye /> : <FaRegEyeSlash />}
          </button>
        </div>

        <label htmlFor="confirmPassword">Confirm Password:</label>
        <div className="relative mb-10">
          <input
            type={showPassword2 ? "text" : "password"}
            id="confirmPassword"
            placeholder="********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-2 border border-black-300 rounded pr-10 w-full"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility2}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-black-600"
          >
            {showPassword2 ? <FaRegEye /> : <FaRegEyeSlash />}
          </button>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleRegister}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition w-9/10">
            Register
          </button>
        </div>

        <p className="text-center mb-6">Do you have an account? <a href="/login" className="text-blue-700 font-bold italic hover:underline">Login?</a></p>

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
