import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"; 
import { useToast } from "../components/ui/use-toast"
import { Loader2 } from "lucide-react"
import axios from "axios"
import { BACKEND_URL } from "../config"
import { Input } from "../components/ui/input";

export default function SignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const navigate = useNavigate();
  const { toast } = useToast()

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage("") // Clear previous errors

    try {
      const response = await axios.post(`${BACKEND_URL}/user/signup`, {
        email,
        password,
        name
      })

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || "Signup failed")
      }

      toast({
        title: "Success",
        description: "Account created successfully! Redirecting..."
      })

      navigate("/auth/sign-in")
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Something went wrong. Please try again."

      if (errorMsg.includes("already exists")) {
        setErrorMessage("An account with this email already exists.")
      } else {
        setErrorMessage(errorMsg)
      }

      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:shadow-blue-500/10 hover:shadow-3xl border border-gray-100">
        <div className="text-center mb-8">
         
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600 text-sm">
            Join CollabBoard to start creating
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
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none hover:bg-gray-100"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email Address
            </label>
            <Input
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
            <Input
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
                <img src="/eye.png" alt="Show" width={22} height={22} className="opacity-70 hover:opacity-100 transition-opacity" />
              ) : (
                <img
                  src="/hidden.png"
                  alt="Hide"
                  width={22}
                  height={22}
                  className="opacity-70 hover:opacity-100 transition-opacity"
                />
              )}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating account...
              </>
            ) : (
              "Sign up"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/auth/sign-in"
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}