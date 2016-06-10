import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import * as numberFormatters from 'in-services/formatters/number';
import DashboardSection from 'in-components/DashboardSection';
import DashboardNotification from 'in-components/DashboardNotification';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';


const chartHeight = 150;

const PhpFpmDashboard = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: timeframeShape
  },

  render() {
    const timeframe = this.props.timeframe;
    const snapshot = this.props.snapshot;
    const pools = snapshot.getIn(['data', 'worker_pools']).toArray();

    if (pools.length === 0) {
      return (<div>No Worker Pools found</div>);
    }

    return (
      <div>
        {pools.map(pool =>
         isStatusPathEnabled(snapshot, pool)
         ? <WorkerPoolMetrics key={pool}
                              snapshot={snapshot}
                              timeframe={timeframe} pool={pool}/>
         : <DashboardNotification key={pool} type='info'>
            In order to monitor the worker pool {pool}, you need to
            enable <code>pm.status_path</code> in your PHP-FPM config.
         </DashboardNotification>
        )}
      </div>
    );
  }
});

export default PhpFpmDashboard;

function WorkerPoolMetrics({snapshot, pool, timeframe}) {
  const data = snapshot.get('data');

  return (
          <div key={pool}>
            <DashboardSection title={'Connections (' + data.get('worker_pool.' + pool + '.pool') + ')'}>
              <ChartWithLegend snapshotId={snapshot.get('id')}
                               timeframe={timeframe}
                               height={chartHeight}
                               margins={{
                                 left: 90,
                                 right: 60
                               }}

                               y1={{
                                 min: 0,
                                 formatter: numberFormatters.zeroDecimalPlaces,
                                 tooltipFormatter: numberFormatters.zeroDecimalPlaces,
                                 metrics: [
                                   'worker_pool.' + pool + '.accepted_conn',
                                   'worker_pool.' + pool + '.slow_requests'
                                 ],
                                 labels: [
                                   'Accepted Connections',
                                   'Slow Requests'
                                 ],
                                 type: 'line'
                               }}

                               y2={{
                                 min: 0,
                                 formatter: numberFormatters.zeroDecimalPlaces,
                                 metrics: [
                                   'worker_pool.' + pool + '.listen_queue',
                                   'worker_pool.' + pool + '.max_listen_queue',
                                   'worker_pool.' + pool + '.listen_queue_len'
                                 ],
                                 labels: [
                                   'Listen Queue',
                                   'Max',
                                   'Length'
                                 ],
                                 type: 'line'
                               }}/>
            </DashboardSection>
            <DashboardSection title={'Processes (' + data.get('worker_pool.' + pool + '.pool') + ')'}>
              <ChartWithLegend snapshotId={snapshot.get('id')}
                               timeframe={timeframe}
                               height={chartHeight}
                               margins={{
                                 left: 90,
                                 right: 60
                               }}

                               y1={{
                                 min: 0,
                                 formatter: numberFormatters.zeroDecimalPlaces,
                                 tooltipFormatter: numberFormatters.zeroDecimalPlaces,
                                 metrics: [
                                   'worker_pool.' + pool + '.idle_processes',
                                   'worker_pool.' + pool + '.active_processes',
                                   'worker_pool.' + pool + '.total_processes'
                                 ],
                                 labels: [
                                   'Idle',
                                   'Active',
                                   'Total'
                                 ],
                                 type: 'line'
                               }}

                               y2={{
                                 min: 0,
                                 formatter: numberFormatters.zeroDecimalPlaces,
                                 metrics: [
                                   'worker_pool.' + pool + '.max_active_processes',
                                   'worker_pool.' + pool + '.max_children_reached'
                                 ],
                                 labels: [
                                   'Max Active',
                                   'Max Children'
                                 ],
                                 type: 'line'
                               }}/>
            </DashboardSection>
            <DashboardSection title={'Resources (' + data.get('worker_pool.' + pool + '.pool') + ')'}>
              <ChartWithLegend snapshotId={snapshot.get('id')}
                               timeframe={timeframe}
                               height={chartHeight}
                               margins={{
                                 left: 90,
                                 right: 60
                               }}
                               y1={{
                                 min: 0,
                                 formatter: numberFormatters.bytesZeroDecimalPlaces,
                                 metrics: ['worker_pool.' + pool + '.total_memory'],
                                 labels: ['Memory'],
                                 type: 'line'
                               }}/>
            </DashboardSection>
        </div>
  );
}

function isStatusPathEnabled(snapshot, pool) {
  return snapshot.getIn(['data', 'worker_pool.' + pool + '.pm_status_path'], 'undefined') !== 'undefined';
}
