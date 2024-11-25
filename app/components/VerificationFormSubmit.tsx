"use client";

import { FC } from "react";
import { useFormStatus } from "react-dom";

// Estilos reutilizables para consistencia
const buttonStyles = {
  base: "font-semibold underline",
  loading: "opacity-50 cursor-not-allowed", // Añadido cursor-not-allowed para mejorar la usabilidad
  normal: "opacity-100",
};

interface Props {}

const VerificationFormSubmit: FC<Props> = () => {
  const { pending } = useFormStatus();
  
  return (
    <button
      disabled={pending}
      type="submit"
      aria-live="polite" // Añadido para accesibilidad, informa sobre cambios en el botón
      className={`${buttonStyles.base} ${pending ? buttonStyles.loading : buttonStyles.normal}`}
    >
      {pending ? "Processing, please wait..." : "Click to Verify"} {/* Texto más claro para cada estado */}
    </button>
  );
};

export default VerificationFormSubmit;
