"use client";

import AuthSubmitButton from "@/app/components/AuthSubmitButton"; // Botón de envío para la autenticación
import { Input } from "@nextui-org/react"; // Componente Input de NextUI para los campos de formulario
import { FC } from "react";
import { useSession } from "next-auth/react"; // Hook para obtener la sesión del usuario
import { updateProfileInfo } from "@/app/actions/auth"; // Acción para actualizar el perfil

interface Props {}

const EditProfile: FC<Props> = () => {
  const { data: session, status, update } = useSession(); // Obtener sesión y estado

  // Mostrar un mensaje de carga mientras se recupera la sesión
  if (status === "loading") return <div>Loading....</div>;

  // Enviar formulario con los nuevos datos del perfil
  return (
    <div className="space-y-6 max-w-96 mx-auto pt-20 sm:p-0 p-4">
      <form action={updateProfileInfo} className="space-y-4">
        {/* Campo para cambiar el nombre */}
        <Input
          name="name"
          type="text"
          id="name"
          placeholder={session?.user?.name || "New Name"} // Muestra el nombre actual del usuario como placeholder
          label="Name"
        />

        {/* Campo para actualizar la foto de perfil */}
        <Input type="file"  id="avatar" name="avatar" accept="image/*" />

        {/* Botón para actualizar el perfil */}
        <AuthSubmitButton label="Update Profile" />
      </form>
    </div>
  );
};

export default EditProfile;
