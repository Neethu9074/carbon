import PropTypes from 'prop-types';
import React from 'react';

import { evaluateClassNames, joinClassNames } from 'in-services/util/classnames';

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

export default function CheckboxFancy({
  label,
  asRadioButton,
  checked,
  onChange,
  className,
  wrapperClassName,
  size,
  style,
  disabled
}) {
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
    <label
      className={evaluateClassNames({
        [locals.label]: true,
        [wrapperClassName]: wrapperClassName
      })}
    >
      {input}
      {label}
    </label>
  ) : (
    input
  );
}

CheckboxFancy.propTypes = {
  asRadioButton: PropTypes.bool,
  checked: PropTypes.bool.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  onChange: PropTypes.func.isRequired,
  size: PropTypes.string,
  style: PropTypes.object,
  wrapperClassName: PropTypes.string
};

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
