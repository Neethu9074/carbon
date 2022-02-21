/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef, Fragment } from 'react';
import classNames from 'classnames';

import { SvgIcon } from '@instana/components';

import CheckboxFancy from 'in-components/form/CheckboxFancy';

import locals from './OptionBox.mless';

interface OptionBoxProps {
  checked?: boolean;
  disabled?: boolean;
  icon: string;
  title: string;
  description: string;
  onChange: (checked: boolean) => void;
  asRadioButton?: boolean;
  className?: string;
}

const OptionBoxWithRef = forwardRef(function OptionBox(
  { checked, disabled, icon, title, description, onChange, asRadioButton, className }: OptionBoxProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const labelContent = (
    <Fragment>
      <SvgIcon type={icon} className={locals.icon} />
      <div className={locals.content}>
        <div className={locals.title}>{title}</div>
        <div className={locals.description}>{description}</div>
      </div>
    </Fragment>
  );

  return (
    <div className={classNames(className, locals.wrapper)} ref={ref}>
      <CheckboxFancy
        label={labelContent}
        asRadioButton={asRadioButton}
        checked={checked}
        disabled={disabled}
        onChange={e => onChange(e.target.checked)}
        size="large"
        verticalLabel
      />
    </div>
  );
});

export default OptionBoxWithRef;
