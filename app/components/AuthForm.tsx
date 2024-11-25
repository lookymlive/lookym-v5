import { FC, FormHTMLAttributes, ReactNode } from "react";
import AuthSubmitButton from "@/app/components/AuthSubmitButton";
import Link from "next/link";
import { continueWithGoogle } from "@/app/actions/auth";

interface Props {
  action?: FormHTMLAttributes<HTMLFormElement>["action"];
  error?: string;
  btnLabel: string;
  title?: string;
  message?: string;
  children: ReactNode;
  footerItems?: { label: string; linkText: string; link: string }[];
}

const AuthForm: FC<Props> = ({
  title,
  btnLabel,
  error,
  children,
  footerItems,
  action,
  message,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/80 backdrop-blur-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] space-y-6">
        <form action={action} className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              {title}
            </h1>
          </div>

          {message && (
            <div className="animate-fadeIn">
              <p className="text-emerald-500 bg-emerald-50 px-4 py-2 rounded-lg text-sm">
                {message}
              </p>
            </div>
          )}
          
          {error && (
            <div className="animate-fadeIn">
              <p className="text-rose-500 bg-rose-50 px-4 py-2 rounded-lg text-sm">
                {error}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {children}
          </div>

          <div>
            <AuthSubmitButton label={btnLabel} />
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 text-gray-500 bg-white/80">or</span>
          </div>
        </div>

        <form action={continueWithGoogle}>
          <AuthSubmitButton label="Continue With Google" />
        </form>

        <div className="space-y-2 text-center">
          {footerItems?.map((item, index) => (
            <div key={index} className="text-sm">
              <span className="text-gray-600">{item.label}{" "}</span>
              <Link 
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors" 
                href={item.link}
              >
                {item.linkText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
