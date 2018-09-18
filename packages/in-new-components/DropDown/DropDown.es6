import { withState } from 'recompose';
import React from 'react';

import DropDownList from 'in-new-components/DropDown/DropDownList';
import SvgIcon from 'in-components/SvgIcon';

import locals from './DropDown.mless';

export default withState('isExpanded', 'setIsExpanded', false)(DropDown);

function DropDown(props) {
  const { isExpanded, setIsExpanded, children } = props;
  return (
    <div className={locals.wrapper}>
      <div className={locals.button} onClick={() => setIsExpanded(!isExpanded)}>
        {children}
        <SvgIcon
          className={locals.chevronIcon}
          type={isExpanded ? 'lib_arrow_drop_up' : 'lib_arrow_drop_down'}
          width={16}
        />
      </div>
      {isExpanded && (
        <DropDownList
          {...props}
          onClick={i => {
            props.onClick(i);
            setIsExpanded(false);
          }}
        />
      )}
    </div>
  );
}
