import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setLoading(false)
    }
    getUser()
  }, [])

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">jObNiX</h1>
          <p className="text-xl mb-8">Find jobs, internships & career guidance — easily.</p>

          {user ? (
            <div className="space-y-4">
              <p className="text-lg">Welcome, {user.email}!</p>
              <Link
                href="/dashboard"
                className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="space-x-4">
              <Link
                href="/login"
                className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="inline-block bg-transparent text-white border-2 border-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-600"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
