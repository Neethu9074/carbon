/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { Button, ButtonProps } from '@instana/legacy';
import { SvgIcon } from '@instana/components';

import locals from './DropdownButton.mless';

interface Props extends ButtonProps {
  expanded?: boolean;
  className?: string;
  spanClassName?: string;
}

const DropdownButton = React.forwardRef<HTMLButtonElement, Props>(function DropdownButton(
  { children, expanded, size, className = '', spanClassName, ...buttonProps },
  ref
) {
  return (
    <Button {...buttonProps} size={size} ref={ref} className={classNames(className, locals.dropdownButton)}>
      <>
        {/* Group into one flexbox item */}
        <span className={spanClassName}>{children}</span>

        <SvgIcon
          type={expanded ? 'lib_arrow_drop_up' : 'lib_arrow_drop_down'}
          className={classNames(locals.dropdownButtonIndicator, {
            [`icon-${size}`]: size
          })}
        />
      </>
    </Button>
  );
});
export default DropdownButton;
