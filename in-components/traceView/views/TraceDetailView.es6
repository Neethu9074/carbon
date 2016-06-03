import React from 'react';

import FullscreenButton from 'in-components/traceView/components/FullscreenButton';
import {toggleFullscreenComponent} from 'in-components/traceView/traceViewStores';
import TraceDetails from 'in-components/traceView/components/TraceDetails';
import SpanDetails from 'in-components/traceView/components/SpanDetails';
import {Tabs, Tab} from 'in-components/Tabs';

import './TraceDetailView.less';

const block = 'in-trace-detail-view';

export default React.createClass({
  displayName: 'TraceDetailView',

  render() {
    return (
      <Tabs collapsible={false}>
        <Tab title='Tree'>
          {/* Firefox treats absolutely positioned elements to be part of the flexbox flow. */}
          <div className={block + '__wrapper'}>
            <FullscreenButton onClick={() => toggleFullscreenComponent('detailView')} />

            <div className={block}>
              <TraceDetails />
              <SpanDetails />
            </div>
          </div>
        </Tab>
      </Tabs>
    );
  }
});
