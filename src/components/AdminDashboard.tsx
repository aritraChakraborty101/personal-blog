import type { Session } from '@supabase/supabase-js'

interface AdminDashboardProps {
  session: Session
}

export default function AdminDashboard({ session }: AdminDashboardProps) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
        <div className="p-6 bg-white border-b border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
          
          <p className="text-gray-600 mb-6">
            Welcome to the admin area, {session.user.email}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Admin Stats */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">Total Users</h3>
              <p className="text-3xl font-bold">0</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-green-700 mb-2">Total Posts</h3>
              <p className="text-3xl font-bold">0</p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-purple-700 mb-2">Pending Approvals</h3>
              <p className="text-3xl font-bold">0</p>
            </div>
          </div>
          
          {/* Admin Actions */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Admin Actions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded">
                Manage Users
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white p-3 rounded">
                Manage Content
              </button>
              <button className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded">
                Site Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}