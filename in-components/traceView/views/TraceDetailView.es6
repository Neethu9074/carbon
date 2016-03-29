import React from 'react';

import FullscreenButton from 'in-components/traceView/components/FullscreenButton';
import {toggleFullscreenComponent} from 'in-components/traceView/traceViewStores';
import TraceDetails from 'in-components/traceView/components/TraceDetails';
import {Tabs, Tab} from 'in-components/Tabs';

export default React.createClass({
  displayName: 'TraceDetailView',

  render() {
    return (
      <Tabs collapsible={false}>
        <Tab title='Tree'>
          <FullscreenButton onClick={() => toggleFullscreenComponent('detailView')} />
          <TraceDetails />
        </Tab>
      </Tabs>
    );
  }
});
