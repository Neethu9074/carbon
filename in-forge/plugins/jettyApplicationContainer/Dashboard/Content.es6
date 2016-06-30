import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {timeframeShape} from 'in-stores/timeline';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import DashboardNotification from 'in-components/DashboardNotification';

import WebAppsTable from './WebAppsTable.es6';

export default React.createClass({

  displayName: 'JettyDashboard',

  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: timeframeShape
  },

  render() {
    const snapshot = this.props.snapshot;
    const timeframe = this.props.timeframe;
    const version = snapshot.getIn(['data', 'version']);
    if (!version) {
      return (
        <DashboardNotification type='info'>
          Jmx module is not enabled in jetty. Please enable it to be able to collect data.
          You can do so by adding '--module=jmx' in 'start.ini' file
        </DashboardNotification>
      );
    }
    return (
      <div>
        <DashboardSection title='Queued Thread Pool Stats'>
          <ChartWithLegend snapshotId={snapshot.get('id')}
                           timeframe={timeframe}
                           height={200}
                           margins={{
                             left: 80
                           }}
                           y1={{
                            metrics: [
                              'idleThreads',
                              'busyThreads',
                              'threads',
                              'threadsQueueSize'
                            ],
                            labels: [
                              'Idle Threads',
                              'Busy Threads',
                              'Total Threads',
                              'Threads Queue Size'
                            ],
                            type: 'line'
                           }}/>
        </DashboardSection>
        <WebAppsTable snapshot={snapshot} timeframe={timeframe}/>
      </div>
    );
  }
});
