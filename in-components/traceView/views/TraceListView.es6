import React from 'react';

import FullscreenButton from 'in-components/traceView/components/FullscreenButton';
import {toggleFullscreenComponent} from 'in-components/traceView/traceViewStores';
import TraceList from 'in-components/traceView/components/TraceList';
import {Tabs, Tab} from 'in-components/Tabs';

export default React.createClass({
  displayName: 'TraceListView',

  render() {
    return (
      <Tabs collapsible={false}>
        <Tab title='List'>
          <FullscreenButton onClick={() => toggleFullscreenComponent('listView')} />
          <TraceList />
        </Tab>
      </Tabs>
    );
  }
});
