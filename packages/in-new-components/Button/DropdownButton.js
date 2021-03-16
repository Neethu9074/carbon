/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import rpt from 'prop-types';
import React from 'react';

import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Button.mless';

const DropdownButton = React.forwardRef(function DropdownButton(props, ref) {
  return (
    <Button {...props} ref={ref} className={classNames(props.className, locals.dropdownButton)}>
      {/* Group into one flexbox item */}
      <span>{props.children}</span>

      <SvgIcon
        type={props.expanded ? 'lib_arrow_drop_up' : 'lib_arrow_drop_down'}
        className={locals.dropdownButtonIndicator}
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
