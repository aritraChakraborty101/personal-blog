import { useState } from 'react'
import { supabase } from '../../supabaseClient'
import { Link } from 'react-router-dom'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [view, setView] = useState('sign-in') // 'sign-in' or 'sign-up'
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) setError(error.message)
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) {
        setError(error.message)
      } else {
        setSuccess('Please check your email for the confirmation link!')
        // Clear form fields after successful signup
        setEmail('')
        setPassword('')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side - About/Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-white flex-col justify-center items-center p-12 border-r border-gray-200">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Aritra's Blog</h1>
          <p className="text-xl mb-6 text-gray-600">A personal space for thoughts, projects, and insights.</p>
          
          {/* About section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left shadow-sm">
            <h2 className="text-xl font-semibold mb-3 text-gray-700">About Me</h2>
            <p className="text-gray-600 mb-4">
              Hi there! I'm a passionate developer and writer sharing my journey through 
              technology, design, and everyday discoveries.
            </p>
            <p className="text-gray-600">
              This blog is where I document my learnings, showcase projects, and connect with 
              like-minded individuals.
            </p>
          </div>
          
          {/* Social icons */}
          <div className="mb-6">
            <h3 className="text-sm uppercase font-semibold tracking-wider text-gray-500 mb-4">Connect With Me</h3>
            <div className="flex justify-center space-x-5">
              <a 
                href="https://github.com/aritraChakraborty101" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-800 transition-colors"
              >
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="https://twitter.com/significantBug" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a 
                href="https://linkedin.com/in/aritra-chakraborty-555715228" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a 
                href="mailto:aritra.chakraborty@g.bracu.ac.bd" 
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <span className="sr-only">Email</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Featured image */}
          <div className="opacity-80">
            <img 
              src="https://illustrations.popsy.co/gray/typewriter.svg" 
              alt="Blog illustration" 
              className="w-full max-w-xs mx-auto"
            />
          </div>
        </div>
      </div>
      
      {/* Right side - Auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              {view === 'sign-in' ? 'Welcome Back' : 'Create Your Account'}
            </h2>
            <p className="text-gray-600 mt-2">
              {view === 'sign-in' 
                ? 'Sign in to access your account' 
                : 'Join our community of writers and readers'}
            </p>
          </div>
          
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}
          
          <form 
            className="bg-white shadow rounded-lg p-8"
            onSubmit={view === 'sign-in' ? handleSignIn : handleSignUp}
          >
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="block text-gray-700 text-sm font-semibold" htmlFor="password">
                  Password
                </label>
                {view === 'sign-in' && (
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-800">
                    Forgot password?
                  </a>
                )}
              </div>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                placeholder={view === 'sign-up' ? 'Choose a secure password' : 'Enter your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <button
                type="submit"
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  view === 'sign-in' ? 'Sign In' : 'Create Account'
                )}
              </button>
            </div>
            
            <div className="text-center">
              <button
                type="button"
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                onClick={() => {
                  setView(view === 'sign-in' ? 'sign-up' : 'sign-in')
                  setError(null)
                  setSuccess(null)
                }}
              >
                {view === 'sign-in' 
                  ? "Don't have an account? Sign Up" 
                  : "Already have an account? Sign In"}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              By signing up, you agree to our 
              <Link to="/terms" className="text-gray-700 hover:text-gray-900 mx-1 underline">Terms of Service</Link>
              and
              <Link to="/privacy" className="text-gray-700 hover:text-gray-900 mx-1 underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}