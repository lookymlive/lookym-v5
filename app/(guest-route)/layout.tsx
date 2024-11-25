
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const GuestLayout: FC<Props> = async ({ children }) => {
  try {
    // Verificar si el usuario está autenticado
    const session = await auth();

    // Si el usuario está autenticado, redirigir a la página principal
    if (session) return redirect("/");
  } catch (error) {
    if (error instanceof Error) {
      if ('statusCode' in error && error.statusCode === 404) {
        // Redirigir a una página de error o mostrar un mensaje de error
        return redirect("/not-found");
      } else {
        console.error("Error in authentication:", error);
        // Redirigir a una página de error o mostrar un mensaje de error
        return redirect("/error");
      }
    }
  }

  // Si no está autenticado, renderizar los children (contenido para invitados)
  return <>{children}</>;
};

export default GuestLayout;;