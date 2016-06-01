import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {
  bytesTwoDecimalPlaces,
  time
} from 'in-services/formatters/number';
import MemoryPoolsTable from 'in-forge/plugins/jvmRuntimePlatform/Dashboard/MemoryPoolsTable';
import JmxMetricsTable from 'in-forge/plugins/jvmRuntimePlatform/Dashboard/JmxMetricsTable';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';


const chartHeight = 200;

export default React.createClass({
  displayName: 'JVMDashboard',

  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: timeframeShape
  },

  render() {
    const timeframe = this.props.timeframe;
    const snapshot = this.props.snapshot;

    const collectors = snapshot.getIn(['data', 'jvm.collectors']);

    return (
      <div>
        <DashboardSection title='Threads'>
          <ChartWithLegend snapshotId={snapshot.get('id')}
                           timeframe={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 60
                           }}

                           y1={{
                             min: 0,
                             metrics: [
                               'threads.new',
                               'threads.runnable',
                               'threads.timed-waiting',
                               'threads.waiting',
                               'threads.blocked',
                               'threads.terminated'
                             ],
                             labels: [
                               'New',
                               'Runnable',
                               'Timed-Waiting',
                               'Waiting',
                               'Blocked',
                               'Terminated'
                             ],
                             type: 'stackedArea'
                           }}/>
        </DashboardSection>

        <DashboardSection title='Memory'>
          <ChartWithLegend snapshotId={snapshot.get('id')}
                           timeframe={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 100
                           }}
                           y1={{
                             min: 0,
                             max: snapshot.getIn(['data', 'memory.max']),
                             formatter: bytesTwoDecimalPlaces,
                             tooltipFormatter: bytesTwoDecimalPlaces,
                             metrics: [
                               'memory.used'
                             ],
                             labels: [
                               'Used'
                             ],
                             type: 'stackedArea'
                           }}/>
        </DashboardSection>

        <MemoryPoolsTable snapshot={snapshot}
                          timeframe={timeframe} />

        {collectors ?
          <DashboardSection title='Garbage Collection'>
            <ChartWithLegend snapshotId={snapshot.get('id')}
                   timeframe={timeframe}
                   height={chartHeight}
                   margins={{
                     left: 80,
                     right: 80
                   }}

                   y1={{
                     metrics: collectors.map((name) =>
                                'gc.' + name + '.time'
                              ).toArray(),
                     labels: collectors.map((name) =>
                                name + ' Time'
                              ).toArray(),
                     type: 'line',
                     formatter: time
                     }}

                   y2={{
                     metrics: collectors.map((name) =>
                                'gc.' + name + '.inv'
                              ).toArray(),
                     labels: collectors.map((name) =>
                                name + ' Invocations'
                              ).toArray(),
                     type: 'point'
                   }}/>
          </DashboardSection>
        : null}

        <JmxMetricsTable snapshot={snapshot}
                         timeframe={timeframe} />
      </div>
    );
  }
});
