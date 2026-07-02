/* =========================================================
   Input.jsx — Reusable input primitive
   Features: floating label, icons, error state, password toggle
   ========================================================= */

import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './Input.css';

const Input = forwardRef(({
  label,
  type = 'text',
  error,
  icon: Icon,
  className = '',
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const classes = [
    'input-group',
    isFocused && 'input-group--focused',
    error && 'input-group--error',
    props.value && 'input-group--filled',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="input-wrapper">
        {Icon && <Icon className="input-icon" size={18} />}
        <input
          ref={ref}
          id={id}
          type={inputType}
          className="input-field"
          placeholder=" "
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {label && (
          <label className="input-label" htmlFor={id}>
            {label}
          </label>
        )}
        {isPassword && (
          <button
            type="button"
            className="input-toggle"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
