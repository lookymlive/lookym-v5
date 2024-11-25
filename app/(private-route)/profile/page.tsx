'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div className="text-center">Cargando...</div>
  }

  if (status !== 'authenticated' || !session) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-primary-600 dark:text-primary-400">Perfil de Usuario</h1>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <p className="text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Nombre:</p>
          <p className="text-gray-900 dark:text-gray-100">{session.user?.name}</p>
        </div>
        <div className="mb-4">
          <p className="text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email:</p>
          <p className="text-gray-900 dark:text-gray-100">{session.user?.email}</p>
        </div>
      </div>
      <Link 
        href="/admin/upload"
        className="inline-block bg-secondary-600 hover:bg-secondary-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
      >
        Subir un nuevo video
      </Link>
    </div>
  )
}