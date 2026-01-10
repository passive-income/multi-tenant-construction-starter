import type React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
};

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  const className = variant === 'primary' ? 'btn btn-primary' : 'btn btn-secondary';
  return (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
