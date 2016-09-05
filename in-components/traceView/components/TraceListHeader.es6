import React from 'react';

import TotalTraceCount from 'in-components/traceView/components/TotalTraceCount';
import TraceViewHeader from 'in-components/traceView/components/TraceViewHeader';
import AutoUpdate from 'in-components/traceView/components/AutoUpdate';
import {refresh} from 'in-components/traceView/stores/traceList';
import SvgIcon from 'in-components/SvgIcon';

import './TraceListHeader.less';

const block = 'in-trace-list-header';

export default function TraceListHeader() {
  return (
    <TraceViewHeader className={block}>
      <div className={`${block}__left-side`}>
        <h1 className={`${block}__title`}>Traces</h1>
        <TotalTraceCount />
      </div>

      <div className={`${block}__right-side`}>
        <SvgIcon type='refresh'
                 onClick={refresh}
                 height={15}
                 className={`${block}__refresh`}/>
        <AutoUpdate />
      </div>
    </TraceViewHeader>
  );
}
