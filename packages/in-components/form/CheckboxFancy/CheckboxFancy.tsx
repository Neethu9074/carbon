/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ChangeEventHandler, CSSProperties, ReactNode } from 'react';
import classNames from 'classnames';

import IndeterminateInput, { IndeterminateInputProps } from './IndeterminateInput';

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

type CheckboxFancyProps = {
  asRadioButton?: boolean;
  /** You *must* defined checked=null or checked=undefined in order to render the
   * indeterminate state. checked=false or checked=true would imply an inconsistent
   * UI state. This is because the UI state cannot have a defined value on one side
   * and present to the user that no value is known.
   *
   * Optional, because indeterminate inputs mean checked=null
   */
  checked?: boolean;
  indeterminate?: boolean;
  className?: string;
  disabled?: boolean;
  label?: ReactNode | string;
  explanation?: ReactNode | string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  size?: 'default' | 'large' | 'larger' | 'largest';
  style?: CSSProperties;
  verticalLabel?: boolean;
  wrapperClassName?: string;
  withControlsGrayscale?: boolean;
  labelClassName?: string;
};

export default function CheckboxFancy({
  asRadioButton,
  checked,
  className,
  disabled,
  explanation,
  indeterminate,
  label,
  labelClassName,
  onChange,
  size,
  style,
  verticalLabel,
  wrapperClassName,
  withControlsGrayscale
}: CheckboxFancyProps) {
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
      className={classNames(locals.labelWrapper, {
        [wrapperClassName ?? '']: wrapperClassName
      })}
    >
      {input}
      {label && (
        <div
          className={classNames({
            [locals.label]: true,
            [locals.verticalLabel]: verticalLabel,
            [locals.disabledLabel]: disabled,
            [labelClassName ?? '']: labelClassName
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

type InputProps = {
  size?: 'default' | 'large' | 'larger' | 'largest';
  checked?: boolean;
  asRadioButton?: boolean;
  withControlsGrayscale?: boolean;
} & Omit<Omit<IndeterminateInputProps, 'checked'>, 'size'>;

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
}: InputProps): JSX.Element {
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
      // this seems to have been buggy all the time: TODO: investigate
      // @ts-expect-error this will never work, because this shorthand form would not create valid css style
      style={{ style }}
    />
  );
}
