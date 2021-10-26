/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { Button, ButtonSizes } from '@instana/components';
import { SvgIcon } from '@instana/components';

import locals from './DropdownButton.mless';

interface Props {
  children: React.ReactNode;
  expanded: boolean;
  size: keyof typeof ButtonSizes;
  className: string;
}

const DropdownButton = React.forwardRef<HTMLButtonElement, Props>(function DropdownButton(
  { children, expanded, size, className, ...buttonProps },
  ref
) {
  return (
    <Button {...buttonProps} size={size} ref={ref} className={classNames(className, locals.dropdownButton)}>
      <>
        {/* Group into one flexbox item */}
        <span>{children}</span>

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
