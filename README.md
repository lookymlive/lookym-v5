.
├── app
│   ├── (guest-route)                 # ruta invitados o usuarios en general que no estan logeados 
│   │   ├── sign-in                   # ruta para el login o inicio de sesion
│   │   │   └── page.tsx              # Pagina de componente de login o inicio de sesion
│   │   ├── sign-up                   # ruta para el registro o creacion de cuenta
│   │   │   └── page.tsx              # Pagina de componente de registro o creacion de cuenta
│   │   ├── update-password           # ruta para el cambio de contraseña
│   │   │   └── page.tsx              # Pagina de componente de cambio de contraseña
│   │   └── update-password           # ruta para el restablecimiento de contraseña
│   │   └── page.tsx                  # Pagina de componente de restablecimiento de contraseña
│   └── layout.tsx                    # Layout de users (no logeados)
│   ├── (private-route)               # ruta privadas o usuarios logeados
│   │   ├── edit-profile              # ruta para el editar el perfil de usuario logueado
│   │   │   └── page.tsx              # Pagina de componente de edicion de perfil de usuario 
│   │   └── profile                   # ruta para el perfil de usuario logueado
│   │       └── page.tsx                  # Pagina de componente de perfil de usuario
│   └── layout.tsx                    # Layout de comercios y users (logueados)
│   ├── actions                        # Acciones de autenticación (exportación de funciones)
│   │   └── auth.ts                    # Acciones de autenticación (exportación de funciones) 
│   ├── api                            # Rutas de API de NextAuth (importación de handlers)
│   │   └── auth                       # Rutas de API de NextAuth (importación de handlers)
│   │       └── [...nextauth]          # destructuración de NextAuth (importación de handlers)
│   │           └── route.ts           # Ruta de NextAuth (importación de handlers)
│   ├── components                     # Componentes comunes
│   │   ├── AuthForm.tsx               # Formulario de autenticación
│   │   ├── AuthSubmitButton.tsx       # Botón de envío en autenticación
│   │   ├── CategoryFilter.tsx         # Filtro de categoría
│   │   ├── Navbar.tsx                 # Barra de navegación
│   │   ├── UpdatePasswordForm.tsx     # Formulario para actualizar contraseña
│   │   ├── UserComments.tsx           # Componente para comentarios de usuario
│   │   ├── VerificationFormSubmit.tsx # Formulario de verificación
│   │   ├── VerificationStatus.tsx     # Estado de verificación
│   │   ├── VerificationSuccess.tsx    # Mensaje de éxito de verificación
│   │   └── VideoGrid.tsx              # Cuadrícula de videos
│   ├── forget-password                # Página para restablecer contraseña
│   │   └── page.tsx                   # Página para recuperación de contraseña
├── lib                                # Librerías y configuraciones
│   ├── cloud.ts                       # Configuración de Cloudinary 
│   └── db.ts                          # Configuración de MongoDB 
├── models                             # Modelos de NextAuth
│   ├── passwordResetToken.ts          # modelos de verificación (si es necesario) Reseteo de contraseña 
│   ├── user.ts                        # Modelo de usuario 
│   └── verification.ts                # Modelo de verificación (si es necesario)
├── utils                              # Utilidades
│   ├── fileHandler.ts                 # Utilidades para manejar archivos
│   ├── mail.ts                        # Configuración de Mailtrap
│   └── verificationSchema.ts          # Esquema para verificación
├── verify                             # Página de verificación
│   └── page.tsx                       # Página de verificación
├── globals.css                        # Estilos globales
├── layout.tsx                         # Layout principal de NextAuth
├── page.tsx                           # Pagina principal de NextAuth
├── providers.tsx                      # Proveedores de NextAuth
├── auth.ts                            # Configuración principal de NextAuth
├── next.config.mjs                    # Configuración de Next.js
├── tailwind.config.ts                 # Configuración de Tailwind CSS
└── tsconfig.json                      # Configuración de TypeScript
├── public                             # Carpetas publicas
│   └── favicon.ico                    # Favicon de la aplicación
├── auth.ts                            # Definición de tipos relacionados con la autenticación, como el usuario y las credenciales.
├── middleware.ts                      # Middleware de NextAuth 
├── next.config.mjs                    # Configuración de Next.js 
├── package-lock.json                  # Archivo de configuración de paquetes de Next.js 
├── package.json                       # Archivo de configuración de paquetes de Next.js
├── postcss.config.cjs                 # Configuración de PostCSS 
├── README.md                          # README de la aplicación 
├── tailwind.config.ts                 # Configuración de Tailwind CSS 
├── tsconfig.json                      # Este archivo contiene la configuración del compilador de TypeScript, definiendo opciones como el objetivo de compilación, la resolución de módulos, etc.
