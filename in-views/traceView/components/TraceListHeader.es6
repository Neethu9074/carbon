import React from 'react';

import { toggleAutoUpdate, autoUpdate$ } from 'in-views/traceView/stores/autoUpdate';
import { expandedSide$, toggleLeft } from 'in-views/traceView/stores/expandedSide';
import ViewHeader from 'in-components/TwoColumnView/components/ViewHeader';
import { refresh } from 'in-views/traceView/stores/traceList';
import AutoUpdate from 'in-components/AutoUpdate';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './TraceListHeader.less';

const block = 'in-trace-list-header';

export default connectTo(
  {
    expandedSide: expandedSide$
  },
  function TraceListHeader({ expandedSide }) {
    return (
      <ViewHeader className={block}>
        <div className={`${block}__left-side`} />

        <div className={`${block}__right-side`}>
          <SvgIcon type="refresh" onClick={refresh} height={15} className={`${block}__refresh`} />
          <AutoUpdate
            checkboxId="trace-view-auto-update"
            autoUpdate$={autoUpdate$}
            toggleAutoUpdate={toggleAutoUpdate}
          />
          <SvgIcon
            type={expandedSide === 'left' ? 'minimize' : 'maximize'}
            onClick={toggleLeft}
            height={14}
            className={`${block}__toggle-left`}
          />
        </div>
      </ViewHeader>
    );
  }
);
