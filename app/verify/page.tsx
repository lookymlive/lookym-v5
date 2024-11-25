import VerificationTokenModel from "@/app/models/verificationToken";
import UserModel from "@/app/models/user";
import { notFound } from "next/navigation";
import VerificationSuccess from "@/app/components/VerificationSuccess";
import { FC } from "react";

interface Props {
  searchParams: {
    token?: string;
    userId?: string;
  };
}

const Verify: FC<Props> = async ({ searchParams }) => {
  const { token, userId } = searchParams;

  if (!token || !userId) {
    // Devuelve una página 404 si falta algún parámetro
    return notFound();
  }

  try {
    const verificationToken = await VerificationTokenModel.findOne({ userId });

    if (!verificationToken || !verificationToken.compare(token)) {
      throw new Error("Invalid token");
    }

    // Actualizar usuario como verificado
    await UserModel.findByIdAndUpdate(userId, { verified: true });
  } catch (error) {
    return notFound();
  } finally {
    // Eliminar el token independientemente del resultado
    await VerificationTokenModel.findOneAndDelete({ userId });
  }

  return <VerificationSuccess message="Your email has been verified successfully!" />;
};

export default Verify;
