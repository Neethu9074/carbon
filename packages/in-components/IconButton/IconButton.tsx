/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import classNames from 'classnames';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { IconComponentProps } from 'in-components/IconButton/types';
import Icon from 'in-components/IconButton/Icon';

import locals from './IconButton.mless';

export interface IconButtonProps extends IconComponentProps {
  /** Can be optionally set to 'button' to avoid getting triggered in a form when user hits enter,
   *  other possible values: 'reset' or 'submit'.
   */
  buttonType?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
}

export default forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(props: IconButtonProps, ref) {
  const { size = 'normal', kind = 'action', onClick, disabled, alignment, className = '', buttonType } = props;

  return (
    <button
      className={classNames({
        [locals.iconButton]: true,
        [locals[`iconButton--${kind}`]]: kind,
        [locals[size]]: size,
        [locals.rightAligned]: alignment === 'right',
        [locals.leftAligned]: alignment === 'left',
        [locals.disabled]: disabled,
        [className]: className
      })}
      onClick={e => (disabled ? stopPropagationAndPreventDefault(e) : onClick?.(e))}
      type={buttonType}
      ref={ref}
    >
      <Icon {...props} />
    </button>
  );
});
