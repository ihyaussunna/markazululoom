'use client';

import { useFormStatus } from 'react-dom';

export default function SubmitButton({ children, className, style, loadingText = 'Processing...', ...props }) {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      className={className} 
      style={{ ...style, opacity: pending ? 0.7 : 1, cursor: pending ? 'not-allowed' : 'pointer' }} 
      disabled={pending}
      {...props}
    >
      {pending ? loadingText : children}
    </button>
  );
}
