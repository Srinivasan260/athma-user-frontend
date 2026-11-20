import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Input } from './input';

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  invalid?: boolean;
  showIcon?: boolean;
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ showIcon = true, ...rest }, ref) {
    const [visible, setVisible] = useState(false);
    return (
      <Input
        ref={ref}
        type={visible ? 'text' : 'password'}
        leftIcon={showIcon ? <Lock className="h-4 w-4" /> : undefined}
        rightIcon={
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="rounded p-1 text-ink-500 hover:text-ink-700 focus-ring"
            aria-label={visible ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
        {...rest}
      />
    );
  },
);
