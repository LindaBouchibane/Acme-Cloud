import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, id, name, className = '', ...rest }: InputProps) {
  const fieldId = id ?? name;

  return (
    <div className={`field ${error ? 'field--error' : ''} ${className}`.trim()}>
      <label className="field__label" htmlFor={fieldId}>
        {label}
        {rest.required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={fieldId}
        name={name}
        className="field__input"
        aria-describedby={error ? `${fieldId}-error` : undefined}
        aria-invalid={!!error}
        {...rest}
      />
      {error && (
        <p id={`${fieldId}-error`} className="field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
