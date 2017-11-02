import React from 'react';

import { expandedSide$, toggleRight } from 'in-views/eventView/stores/expandedSide';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './EventDetailHeader.less';

const block = 'in-event-view-event-detail-header';

export default connectTo(
  {
    expandedSide: expandedSide$
  },
  function EventDetailHeader({ expandedSide }) {
    return (
      <div className={block}>
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
