'use client'

import { useTheme } from 'next-themes' // paquete next-themes
import { Button } from '@/components/ui/button' // componente Button de shadcn/ui
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Evitar renderizado del botón hasta que esté montado el cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  // Evitar que se renderice en SSR para evitar "flash" de tema
  if (!mounted) {
    return null
  }

  return (
    <Button
      variant="default" // estilo del botón, puedes ajustarlo según tu diseño
      size="lg" // tamaño del botón
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} // alterna entre temas
      aria-label="Toggle theme"
      className="flex items-center gap-2" // estilo opcional para alinear iconos y texto
    >
      {theme === 'dark' ? (
        <>
          <Sun className="h-5 w-5" /> Light
        </>
      ) : (
        <>
          <Moon className="h-5 w-5" /> Dark
        </>
      )}
    </Button>
  )
}
