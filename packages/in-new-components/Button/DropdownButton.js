import rpt from 'prop-types';
import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Button.mless';

export default function DropdownButton(props) {
  return (
    <Button {...props} className={joinClassNames(props.className, locals.dropdownButton)}>
      {/* Group into one flexbox item */}
      <span>{props.children}</span>

      <SvgIcon
        type={props.expanded ? 'lib_arrow_drop_up' : 'lib_arrow_drop_down'}
        className={locals.dropdownButtonIndicator}
      />
    </Button>
  );
}

DropdownButton.propTypes = {
  ...Button.propTypes,

  // Changes the direction of the expansion arrow
  expanded: rpt.bool
};
