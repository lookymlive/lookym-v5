'use client';

import { FC } from 'react';
import { useFormStatus } from 'react-dom';

interface Props {}

const buttonStyles = {
  base: 'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200',
  normal: 'text-white bg-blue-600 hover:bg-blue-700',
  loading: 'text-white bg-blue-400 cursor-not-allowed'
};

const VerificationFormSubmit: FC<Props> = () => {
  const { pending } = useFormStatus();
  
  return (
    <button
      disabled={pending}
      type="submit"
      aria-live="polite"
      className={`${buttonStyles.base} ${pending ? buttonStyles.loading : buttonStyles.normal}`}
    >
      {pending ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : (
        'Resend Email'
      )}
    </button>
  );
};

export default VerificationFormSubmit;