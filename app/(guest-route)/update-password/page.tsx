import AuthSubmitButton from "@/app/components/AuthSubmitButton";
import UpdatePasswordForm from "@/app/components/UpdatePasswordForm";
import startDb from "@/app/lib/db";
import PassResetTokenModel from "@/app/models/passwordResetToken";
import { Input } from "@nextui-org/react";
import { notFound } from "next/navigation";
import { FC } from "react";

interface Props {
  searchParams: {
    token: string;
    userId: string;
  } & Promise<any>;
}

const UpdatePassword: FC<Props> = async ({ searchParams }) => {
  const { token, userId } = searchParams;

  try {
    await startDb();
    const resetToken = await PassResetTokenModel.findOne({ userId });
    if (!resetToken?.compare(token)) {
      throw new Error();
    }
  } catch (error) {
    return notFound();
  }

  return <UpdatePasswordForm token={token} userId={userId} />;
};

export default UpdatePassword;
