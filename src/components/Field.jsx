import { useState } from 'react'
import { IconEye, IconEyeOff } from './Icons.jsx'

export function Field({ label, error, hint, icon, trailing, className = '', ...inputProps }) {
  return (
    <div className={`field ${className}`}>
      {label && <label className="field-label">{label}</label>}
      <div className="input-wrap">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          className={`input ${icon ? 'has-icon' : ''} ${trailing ? 'has-trail' : ''} ${error ? 'error' : ''}`}
          {...inputProps}
        />
        {trailing}
      </div>
      {error ? (
        <span className="field-error">{error}</span>
      ) : hint ? (
        <span className="field-hint">{hint}</span>
      ) : null}
    </div>
  )
}

export function PasswordField({ label, error, hint, icon, ...inputProps }) {
  const [show, setShow] = useState(false)
  return (
    <Field
      label={label}
      error={error}
      hint={hint}
      icon={icon}
      type={show ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          className="input-trail"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {show ? <IconEyeOff size={20} /> : <IconEye size={20} />}
        </button>
      }
      {...inputProps}
    />
  )
}
