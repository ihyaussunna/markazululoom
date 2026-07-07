'use client';

import { useFormStatus } from 'react-dom';

export default function SubmitButton({ children, className, style, loadingText = 'Processing...', ...props }) {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      className={className} 
      style={{ ...style, opacity: pending ? 0.7 : 1, cursor: pending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} 
      disabled={pending}
      {...props}
    >
      {pending && (
        <svg className="animate-spin" style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }}></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style={{ opacity: 0.75 }}></path>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </svg>
      )}
      {pending ? loadingText : children}
    </button>
  );
}
