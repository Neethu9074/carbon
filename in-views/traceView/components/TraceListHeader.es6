import React from 'react';

import { toggleAutoUpdate, autoUpdate$ } from 'in-views/traceView/stores/autoUpdate';
import ViewHeader from 'in-components/TwoColumnView/components/ViewHeader';
import { refresh, traces$ } from 'in-views/traceView/stores/traceList';
import { totalTraceCountActiveFilter$ } from 'in-stores/traces';
import Count from 'in-views/traceView/components/Count';
import AutoUpdate from 'in-components/AutoUpdate';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './TraceListHeader.less';

const block = 'in-trace-list-header';

export default connectTo(
  {
    traces: traces$
  },
  function TraceListHeader() {
    return (
      <ViewHeader className={block}>
        <div className={`${block}__left-side`}>
          <strong className={`${block}__count`}>
            Traces <Count count$={totalTraceCountActiveFilter$} />
          </strong>
        </div>
        <div className={`${block}__right-side`}>
          <SvgIcon type="refresh" onClick={refresh} height={15} className={`${block}__refresh`} />
          <AutoUpdate
            checkboxId="trace-view-auto-update"
            autoUpdate$={autoUpdate$}
            toggleAutoUpdate={toggleAutoUpdate}
          />
        </div>
      </ViewHeader>
    );
  }
);
