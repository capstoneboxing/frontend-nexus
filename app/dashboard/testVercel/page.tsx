// ./app/dashboard/testVercel/page.tsx
'use client' // 🚨 Must be first line for Client Components

// ==========================
// IMPORTS
// ==========================
import { supabase } from '../../../lib/supabaseClient' // your Supabase connection
import { useEffect, useState } from 'react'

// ==========================
// COMPONENT
// ==========================
export default function TestVercel() {
  // --------------------------
  // STATE
  // --------------------------
  // Holds the data fetched from Supabase
  const [admins, setAdmins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // --------------------------
  // EFFECT: Fetch data on page load
  // --------------------------
  useEffect(() => {
    async function fetchAdmins() {
      console.log('🔹 Fetching admin table from Supabase...')

      const { data, error } = await supabase
        .from('admin') // <-- replace 'admin' with your table name
        .select('*')

      if (error) {
        console.error('❌ Supabase error:', error)
      } else {
        console.log('✅ Supabase data fetched:', data)
        setAdmins(data) // store data in state for display
      }

      setLoading(false) // done loading
    }

    fetchAdmins()
  }, [])

  // ==========================
  // RENDER
  // ==========================
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Supabase Admin Table Test</h1>

      {/* Loading indicator */}
      {loading && <p>Loading data from Supabase...</p>}

      {/* Display admins */}
      {!loading && admins.length > 0 ? (
        <ul>
          {admins.map((admin: any) => (
            <li key={admin.id}>
              <strong>ID:</strong> {admin.admin_id} &nbsp; 
              <strong>Name:</strong> {admin.username}
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>No data found in the admin table.</p>
      )}

      {/* Console instructions */}
      <p style={{ marginTop: '2rem', fontStyle: 'italic', color: '#555' }}>
        Check the browser console for the full Supabase fetch output.
      </p>
    </div>
  )
}