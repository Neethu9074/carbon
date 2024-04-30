/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { forwardRef } from 'react';

import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import BetaBadge from 'in-components/BetaBadge/BetaBadge';

import locals from 'in-synthetics/createTests/advanced/SimpleOrScriptOption.mless';

interface SimpleOrScriptOptionProps {
  checked?: boolean;
  disabled?: boolean;
  title: string;
  description: JSX.Element;
  asRadioButton?: boolean;
  isSSLCertificate?: boolean;
  onChange: (checked: boolean) => void;
}

const SimpleOrScriptOption = ({
  checked,
  disabled,
  title,
  description,
  asRadioButton,
  isSSLCertificate,
  onChange
}: SimpleOrScriptOptionProps) => {
  return (
    <OptionBoxWithRef
      checked={checked}
      disabled={disabled}
      title={title}
      description={description}
      asRadioButton={asRadioButton}
      isSSLCertificate={isSSLCertificate}
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
  isSSLCertificate?: boolean;
  onChange: (checked: boolean) => void;
}

const OptionBoxWithRef = forwardRef(function OptionBox(
  { checked, disabled, title, description, onChange, asRadioButton, isSSLCertificate }: OptionBoxProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const labelContent = (
    <div className={locals.content}>
      <div className={locals.title}>
        <span>{title}</span>
        {isSSLCertificate ? <BetaBadge /> : null}
      </div>
      <div className={locals.description}>{description}</div>
    </div>
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

export default SimpleOrScriptOption;
