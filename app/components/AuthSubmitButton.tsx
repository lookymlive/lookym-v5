"use client";
import { FC } from "react";

interface Props {
  label: string;
  loading?: boolean;
}

const AuthSubmitButton: FC<Props> = ({ label, loading = false }) => {
  return (
    <button
      type="submit"
      className={`
        w-full px-4 py-3 text-sm font-medium text-white
        bg-gradient-to-r from-indigo-600 to-cyan-600
        hover:from-indigo-500 hover:to-cyan-500
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        rounded-lg transition-all duration-200 ease-in-out
        flex items-center justify-center space-x-2
      `}
      disabled={loading}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span>{loading ? "Processing..." : label}</span>
    </button>
  );
};

export default AuthSubmitButton;