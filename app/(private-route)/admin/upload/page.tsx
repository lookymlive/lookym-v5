'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function UploadVideo() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return

    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    formData.append('description', description)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        router.push('/profile')
      } else {
        const error = await response.json()
        console.error('Upload failed:', error)
        alert('Error al subir el video. Por favor, intenta de nuevo.')
      }
    } catch (error: unknown) {
      console.error('Error:', error);
      alert('Error al subir el video. Por favor, intenta de nuevo.');
    } finally {
      setUploading(false)
    }
  }

  if (status === 'loading') {
    return <div className="text-center">Cargando...</div>
  }

  if (status !== 'authenticated' || !session) {
    return <div className="text-center">Por favor, inicia sesión para subir videos.</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-primary-600 dark:text-primary-400">Subir Video</h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Título</label>
          <input
            type="text"
            id="title"
            name='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Descripción</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
            rows={4}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="video" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Archivo de Video</label>
          <input
            type="file"
            id="video"
            name="video"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
        <button 
          type="submit" 
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
          disabled={uploading}
        >
          {uploading ? 'Subiendo...' : 'Subir Video'}
        </button>
      </form>
    </div>
  )
}