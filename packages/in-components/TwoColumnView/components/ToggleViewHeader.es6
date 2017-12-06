import React from 'react';

import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './ToggleViewHeader.less';

const block = 'in-two-columns-view-toggle-header';

export default connectTo(
  props => ({
    expandedSide: props.expandedSide$
  }),
  function ToggleViewHeader({ expandedSide, toggleRight, onClear }) {
    return (
      <div className={block}>
        <SvgIcon type="x" onClick={onClear} height={8} className={`${block}__toggle-left`} />
        <SvgIcon
          type={expandedSide === 'right' ? 'minimize' : 'maximize'}
          onClick={toggleRight}
          height={14}
          className={`${block}__toggle-right`}
        />
      </div>
    );
  }
);
