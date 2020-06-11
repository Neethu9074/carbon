import PropTypes from 'prop-types';
import React from 'react';

import IndeterminateInput from 'in-components/form/CheckboxFancy/IndeterminateInput';
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
  verticalLabel
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
      className={evaluateClassNames({
        [locals.labelWrapper]: true,
        [wrapperClassName]: wrapperClassName
      })}
    >
      {input}
      {label && (
        <div
          className={evaluateClassNames({
            [locals.label]: true,
            [locals.verticalLabel]: verticalLabel
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
  checked: PropTypes.bool.isRequired,
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
  withControlsGrayscale: PropTypes.bool
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
      className={joinClassNames(
        locals.control,
        asRadioButton ? locals.radiobutton : locals.checkbox,
        sizes[size].className,
        className,
        evaluateClassNames({
          [locals.withControlsGrayscale]: withControlsGrayscale
        })
      )}
      style={{ style }}
    />
  );
}
