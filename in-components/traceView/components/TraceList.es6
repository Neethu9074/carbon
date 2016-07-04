import React from 'react';

import TraceTableHeader from 'in-components/traceView/components/TraceTableHeader';
import TotalTraceCount from 'in-components/traceView/components/TotalTraceCount';
import TraceHeading from 'in-components/traceView/components/TraceHeading';
import AutoUpdate from 'in-components/traceView/components/AutoUpdate';
import TraceTable from 'in-components/traceView/components/TraceTable';
import TabHeader from 'in-components/traceView/components/TabHeader';
import {refresh} from 'in-components/traceView/traceViewStore';
import Icon from 'in-components/Icon';

import './TraceList.less';


const block = 'in-trace-list';

export default function TraceList() {
  return (
    <div className={block}>
      <TabHeader left={
                  <TraceHeading>
                    Traces <TotalTraceCount />
                  </TraceHeading>
                }
                 right={
                   <span className={block + '__actions'}>
                      <Icon type='reload'
                            onClick={refresh}
                            className={block + '__reload'}/>
                      <AutoUpdate />
                   </span>
                 }/>

      <TraceTableHeader />
      <TraceTable />
    </div>
  );
}
