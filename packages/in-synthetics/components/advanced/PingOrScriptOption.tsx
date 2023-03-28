/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { forwardRef } from 'react';

import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';

import locals from './PingOrScriptOption.mless';

interface PingOrScriptOptionProps {
  checked?: boolean;
  disabled?: boolean;
  title: string;
  description: JSX.Element;
  asRadioButton?: boolean;
  onChange: (checked: boolean) => void;
}

const PingOrScriptOption = ({
  checked,
  disabled,
  title,
  description,
  asRadioButton,
  onChange
}: PingOrScriptOptionProps) => {
  return (
    <OptionBoxWithRef
      checked={checked}
      disabled={disabled}
      title={title}
      description={description}
      asRadioButton={asRadioButton}
      onChange={onChange}
    />
  );
};

interface OptionBoxProps {
  checked?: boolean;
  disabled?: boolean;
  title: string;
  description: JSX.Element;
  asRadioButton?: boolean;
  onChange: (checked: boolean) => void;
}

const OptionBoxWithRef = forwardRef(function OptionBox(
  { checked, disabled, title, description, onChange, asRadioButton }: OptionBoxProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const labelContent = (
    <>
      <div className={locals.content}>
        <div className={locals.title}>{title}</div>
        <div className={locals.description}>{description}</div>
      </div>
    </>
  );
  return (
    <div className={locals.wrapper} ref={ref}>
      <CheckboxFancy
        label={labelContent}
        asRadioButton={asRadioButton}
        checked={checked}
        disabled={disabled}
        onChange={e => {
          onChange(e.target.checked);
        }}
        size="large"
        verticalLabel
      />
    </div>
  );
});

export default PingOrScriptOption;
