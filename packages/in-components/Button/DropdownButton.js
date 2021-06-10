/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import rpt from 'prop-types';
import React from 'react';

import { SvgIcon } from '@instana/components';
import { Button } from '@instana/components';

import locals from './DropdownButton.mless';

const DropdownButton = React.forwardRef(function DropdownButton(
  { children, expanded, size, className, ...buttonProps },
  ref
) {
  return (
    <Button {...buttonProps} size={size} ref={ref} className={classNames(className, locals.dropdownButton)}>
      {/* Group into one flexbox item */}
      <span>{children}</span>

      <SvgIcon
        type={expanded ? 'lib_arrow_drop_up' : 'lib_arrow_drop_down'}
        className={classNames(locals.dropdownButtonIndicator, {
          [`icon-${size}`]: size
        })}
      />
    </Button>
  );
});
export default DropdownButton;

DropdownButton.propTypes = {
  ...Button.propTypes,

  // Changes the direction of the expansion arrow
  expanded: rpt.bool
};
