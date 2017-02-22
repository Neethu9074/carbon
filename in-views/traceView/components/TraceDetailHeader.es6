import React from 'react';

import {expandedSide$, toggleRight} from 'in-views/traceView/stores/expandedSide';
import ViewHeader from 'in-components/TwoColumnView/components/ViewHeader';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './TraceDetailHeader.less';


const block = 'in-trace-detail-header';

export default connectTo({
  expandedSide: expandedSide$
},
function TraceDetailHeader({expandedSide}) {
  return (
    <ViewHeader className={block}>
      <SvgIcon type={expandedSide === 'right' ? 'minimize' : 'maximize'}
               onClick={toggleRight}
               height={14}
               className={`${block}__toggle-right`} />
    </ViewHeader>
  );
});
