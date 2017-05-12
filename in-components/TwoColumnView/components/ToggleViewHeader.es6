import React from 'react';

import ViewHeader from 'in-components/TwoColumnView/components/ViewHeader';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './ToggleViewHeader.less';

const block = 'in-two-columns-view-toggle-header';

export default connectTo(
  props => {
    return {
      expandedSide: props.expandedSide$
    };
  },
  function TraceDetailHeader({ expandedSide, side, toggle, leftChildren }) {
    return (
      <ViewHeader className={block}>
        {leftChildren || <span>&nbsp;</span>}
        <SvgIcon
          type={expandedSide === side ? 'minimize' : 'maximize'}
          onClick={toggle}
          height={14}
          className={`${block}__toggle`}
        />
      </ViewHeader>
    );
  }
);
