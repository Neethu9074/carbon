import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';

import locals from './CheckboxFancy.mless';

const sizes = {
  default: {
    className: locals.sizeDefault
  },
  large: {
    className: locals.sizeLarge
  },
  larger: {
    className: locals.sizeLarger
  },
  largest: {
    className: locals.sizeLargest
  }
};

export default function CheckboxFancy({ label, asRadioButton, checked, onChange, className, size, style, disabled }) {
  const input = (
    <Input
      checked={checked}
      onChange={onChange}
      asRadioButton={asRadioButton}
      className={className}
      size={size}
      style={style}
      disabled={disabled}
    />
  );
  return label ? (
    <label className={locals.label}>
      {input}
      {label}
    </label>
  ) : (
    input
  );
}

function Input({ checked, onChange, asRadioButton, className, size = 'default', style, disabled }) {
  return (
    <input
      type={asRadioButton ? 'radio' : 'checkbox'}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className={joinClassNames(
        locals.control,
        asRadioButton ? locals.radiobutton : locals.checkbox,
        sizes[size].className,
        className
      )}
      style={{ style }}
    />
  );
}
