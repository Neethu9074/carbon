/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import IndeterminateInput from 'in-components/form/CheckboxFancy/IndeterminateInput';

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
  explanation,
  asRadioButton,
  checked,
  indeterminate,
  onChange,
  className,
  wrapperClassName,
  size,
  style,
  disabled,
  withControlsGrayscale,
  verticalLabel,
  labelClassName
}) {
  const input = (
    <Input
      checked={checked}
      indeterminate={indeterminate}
      onChange={onChange}
      asRadioButton={asRadioButton}
      className={className}
      size={size}
      style={style}
      disabled={disabled}
      withControlsGrayscale={withControlsGrayscale}
    />
  );
  return label ? (
    <label
      className={classNames({
        [locals.labelWrapper]: true,
        [wrapperClassName]: wrapperClassName
      })}
    >
      {input}
      {label && (
        <div
          className={classNames({
            [locals.label]: true,
            [locals.verticalLabel]: verticalLabel,
            [labelClassName]: labelClassName
          })}
        >
          {label}
        </div>
      )}
      {explanation && <div className={locals.explanation}>{explanation}</div>}
    </label>
  ) : (
    input
  );
}

CheckboxFancy.propTypes = {
  asRadioButton: PropTypes.bool,

  // Not required because indeterminate inputs mean checked=null
  checked: PropTypes.bool,
  // You *must* defined checked=null or checked=undefined in order to render the
  // indeterminate state. checked=false or checked=true would imply an inconsistent
  // UI state. This is because the UI state cannot have a defined value on one side
  // and present to the user that no value is known.
  indeterminate: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  explanation: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  onChange: PropTypes.func.isRequired,
  size: PropTypes.string,
  style: PropTypes.object,
  verticalLabel: PropTypes.bool,
  wrapperClassName: PropTypes.string,
  withControlsGrayscale: PropTypes.bool,
  labelClassName: PropTypes.string
};

function Input({
  checked,
  indeterminate,
  onChange,
  asRadioButton,
  className,
  size = 'default',
  style,
  disabled,
  withControlsGrayscale
}) {
  return (
    <IndeterminateInput
      type={asRadioButton ? 'radio' : 'checkbox'}
      checked={checked}
      indeterminate={indeterminate}
      onChange={onChange}
      disabled={disabled}
      className={classNames(
        locals.control,
        asRadioButton ? locals.radiobutton : locals.checkbox,
        sizes[size].className,
        className,
        classNames({
          [locals.withControlsGrayscale]: withControlsGrayscale
        })
      )}
      style={{ style }}
    />
  );
}
