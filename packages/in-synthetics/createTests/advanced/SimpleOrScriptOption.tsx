/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { forwardRef } from 'react';

import {RadioButton, Checkbox} from '@instana/components';

import locals from 'in-synthetics/createTests/advanced/SimpleOrScriptOption.mless';

interface SimpleOrScriptOptionProps {
  checked?: boolean;
  disabled?: boolean;
  title: string;
  description: JSX.Element;
  asRadioButton?: boolean;
  onChange: (checked: boolean) => void;
}

const SimpleOrScriptOption = ({
  checked,
  disabled,
  title,
  description,
  asRadioButton,
  onChange
}: SimpleOrScriptOptionProps) => {
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
    <div className={locals.content}>
      <div className={locals.title}>
        <span>{title}</span>
      </div>
      <div className={locals.description}>{description}</div>
    </div>
  );

  const BoxComponent = asRadioButton ? RadioButton : Checkbox;
  return (
    <div className={locals.wrapper} ref={ref}>
      <BoxComponent
        label={labelContent}
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

export default SimpleOrScriptOption;
