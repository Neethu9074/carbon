/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';

import { SvgIcon } from '@instana/components';

import CheckboxFancy from 'in-components/form/CheckboxFancy';
import FeatureFeedback from 'in-components/FeatureFeedback';

import locals from './OptionBox.mless';

interface OptionBoxProps {
  checked?: boolean;
  disabled?: boolean;
  icon: string;
  title: string;
  description: string;
  /** When available, this will render a featureFeedback box with a beta badge */
  featureFeedbackLink?: string;
  onChange: (checked: boolean) => void;
  asRadioButton?: boolean;
  className?: string;
}

const OptionBoxWithRef = forwardRef(function OptionBox(
  {
    checked,
    disabled,
    icon,
    title,
    description,
    onChange,
    asRadioButton,
    className,
    featureFeedbackLink
  }: OptionBoxProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const labelContent = (
    <>
      <SvgIcon type={icon} className={locals.icon} />
      <div className={locals.content}>
        <div className={locals.title}>{title}</div>
        <div className={locals.description}>
          {description}
          {featureFeedbackLink && (
            <div className={locals.betaBadge}>
              <FeatureFeedback href={featureFeedbackLink} />
            </div>
          )}
        </div>
      </div>
    </>
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
