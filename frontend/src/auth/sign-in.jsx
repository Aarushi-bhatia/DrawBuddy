import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"; 
import { useAuth } from "../lib/auth"
import { Loader2 } from "lucide-react"
import { BACKEND_URL } from "../config"
import axios from "axios"

const GUEST_CREDENTIALS = {
  email: "user@gmail.com",
  password: "12345678"
}

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")  
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e, isGuest = false) => {
    if (e) e.preventDefault()
    setLoading(true)
    setErrorMessage("") // Clear previous errors

    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/login`,
        isGuest ? GUEST_CREDENTIALS : { email, password }
      )
      const data = response.data

      if (data.success) {
        setToken(data.data.token)
        setUser(data.data.user)
        navigate("/dashboard")
      } else {
        setErrorMessage(data.message || "Invalid email or password")
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Something went wrong. Try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="min-h-screen flex items-center justify-center bg-white from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        

        <div className="bg-white/95 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:shadow-blue-500/20 hover:shadow-3xl relative z-10 border border-white/20">
          <div className="text-center mb-8">
           
            <h1 className="text-4xl font-bold bg-black bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-sm">
              Sign in to continue to CollabBoard
            </p>
          </div>

          {errorMessage && (
            <div className="text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl mb-6 text-center text-sm font-medium animate-shake">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none hover:bg-gray-100"
              />
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pr-12 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none hover:bg-gray-100"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[42px] text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
              >
                {showPassword ? (
                  <img src="/eye.png" alt="Show" width={22} className="opacity-70 hover:opacity-100 transition-opacity" />
                ) : (
                  <img src="/hidden.png" alt="Hide" width={22} className="opacity-70 hover:opacity-100 transition-opacity" />
                )}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/auth/sign-up"
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}