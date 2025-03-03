/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useContext } from 'react';
import classNames from 'classnames';

import { SvgIcon, SvgIconSizes, ThemeContext } from '@instana/components';

import { stopPropagation, stopPropagationAndPreventDefault } from 'in-services/util/function';
import { PropsType } from 'in-components/Button/LegacyButtonTypes';

import locals from 'in-components/Button/LegacyButton.mless';

type SvgSize = keyof typeof SvgIconSizes | number;

const iconDimensions: Record<string, SvgSize> = {
  xl: 'regular',
  normal: 'regular',
  compact: 'xs'
};

/**
 * This is a temporary solution, to replace the import from @instana/legacy, until a new Button compoent will be designed
 *
 * @deprecated do NOT use this component - it is only kept until a Carbon based Design for Analyse-header Selection
 * Button, and for InfraStructure Explore Button is available.
 */
export const LegacyButton = React.forwardRef<any, PropsType>(function Button(
  {
    icon,
    iconSpinning,
    iconSize,
    formId,
    className = '',
    kind = 'primary',
    size = 'normal',
    type = 'button',
    onClick,
    style,
    children,
    href,
    disabled,
    target,
    noAutoMargin,
    refSetter,
    ...otherProps
  }: PropsType,
  ref
) {
  const theme = useContext(ThemeContext);

  const classes: string = classNames('component-base', className, {
    [locals.button]: true,
    [locals['button-disabled']]: !!disabled,
    [locals[`button-${theme}`]]: !!theme,
    [locals[`button-${kind}`]]: !!kind,
    [locals[`button-${size}`]]: !!size,
    [locals['button-noAutoMargin']]: !!noAutoMargin
  });

  if (disabled) {
    onClick = stopPropagationAndPreventDefault;
  }

  let iconElement;
  if (icon) {
    iconElement = (
      <SvgIcon
        className={classNames({
          [locals['button-icon']]: true,
          [locals['button-noHorizontalMargin']]: !children
        })}
        type={icon}
        spinning={iconSpinning}
        size={iconSize || iconDimensions[size]}
      />
    );
  }

  if (href === undefined) {
    return (
      <button
        form={formId}
        className={classes}
        onClick={onClick}
        style={style}
        type={type}
        ref={ref || refSetter}
        disabled={disabled}
        {...otherProps}
      >
        {iconElement} {children}
      </button>
    );
  }

  let content = (
    <a
      href={href}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      className={classes}
      onClick={onClick ?? stopPropagation}
      style={style}
      ref={ref || refSetter}
      {...otherProps}
    >
      {iconElement} {children}
    </a>
  );

  return content;
});
