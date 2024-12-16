/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';

import { SvgIcon, RadioButton, Checkbox, PreviewPill } from '@instana/components';

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
  isBeta?: boolean;
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
    featureFeedbackLink,
    isBeta
  }: OptionBoxProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const labelContent = (
    <>
      <div className={locals.content}>
        <div className={locals.titlediv}>
          {icon && (
            <div>
              <SvgIcon type={icon} className={locals.icononly} />
            </div>
          )}
          <div>{title}</div>
        </div>
        {(description || featureFeedbackLink || isBeta) && (
          <div className={locals.description}>
            {description}
            {isBeta && (
              <div className={locals.space}>
                <PreviewPill />
              </div>
            )}
            {featureFeedbackLink && (
              <div className={locals.betaBadge}>
                <FeatureFeedback href={featureFeedbackLink} />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );

  const BoxComponent = asRadioButton ? RadioButton : Checkbox;
  return (
    <div className={classNames(className, locals.wrapper)} ref={ref}>
      <BoxComponent
        label={labelContent}
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
