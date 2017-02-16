import React from 'react';

import ViewHeader from 'in-components/TwoColumnView/components/ViewHeader';
import {toggleRight} from 'in-views/traceView/stores/expandedSide';
import SvgIcon from 'in-components/SvgIcon';

import './TraceDetailHeader.less';

const block = 'in-trace-detail-header';

export default function TraceDetailHeader() {
  return (
    <ViewHeader className={block}>
      <SvgIcon type='fullscreen'
               onClick={toggleRight}
               height={14}
               className={`${block}__toggle-right`} />
    </ViewHeader>
  );
}
