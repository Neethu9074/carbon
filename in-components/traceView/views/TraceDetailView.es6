import React from 'react';

import FullscreenButton from 'in-components/traceView/components/FullscreenButton';
import {toggleFullscreenComponent} from 'in-components/traceView/traceViewStores';
import TraceDetails from 'in-components/traceView/components/TraceDetails';
import SpanDetails from 'in-components/traceView/components/SpanDetails';
import {Tabs, Tab} from 'in-components/Tabs';

import './TraceDetailView.less';

export default React.createClass({
  displayName: 'TraceDetailView',

  render() {
    return (
      <Tabs collapsible={false}>
        <Tab title='Tree'>
          <div className='in-trace-detail-view'>
            <FullscreenButton onClick={() => toggleFullscreenComponent('detailView')} />
            <TraceDetails />
            <SpanDetails />
          </div>
        </Tab>
      </Tabs>
    );
  }
});
