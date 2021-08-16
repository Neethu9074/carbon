/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';

import { IconComponentProps } from 'in-components/IconButton/types';
import Icon from 'in-components/IconButton/Icon';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';

// @ts-ignore
import locals from './IconButton.mless';

interface IconButtonProps extends IconComponentProps {}

export default forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(props: IconButtonProps, ref) {
  const { size = 'normal', kind = 'action', onClick, disabled, alignment, className = '' } = props;

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
      ref={ref}
    >
      <Icon {...props} />
    </button>
  );
});
