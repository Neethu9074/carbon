import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import * as numberFormatters from 'in-services/formatters/number';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';

const chartHeight = 150;
const rpt = React.PropTypes;

const PhpFpmDashboard = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    timeframe: rpt.object.isRequired,
    snapshot: irpt.map.isRequired
  },

  render() {
    const timeframe = this.props.timeframe;
    const snapshot = this.props.snapshot;
    const data = this.props.snapshot.get('data');
    const pools = data.get('worker_pools').toArray();

    if (pools.length === 0) {
      return (<div>No Worker Pools found</div>);
    }

    return (
      <div>
        {pools.map(pool =>
          <div key={pool}>
            <DashboardSection title={'Connections (' + data.get('worker_pool.' + pool + '.pool') + ')'}>
              <ChartWithLegend snapshot={snapshot}
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
              <ChartWithLegend snapshot={snapshot}
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
              <ChartWithLegend snapshot={snapshot}
                               windowSize={timeframe}
                               height={chartHeight}
                               margins={{
                                 left: 90,
                                 right: 60
                               }}

                               y1={{
                                 min: 0,
                                 formatter: numberFormatters.percentageTwoDecimalPlaces,
                                 tooltipFormatter: numberFormatters.percentageTwoDecimalPlaces,
                                 metrics: [ 'worker_pool.' + pool + '.total_cpu'],
                                 labels: ['CPU Time %'],
                                 type: 'line'
                               }}

                               y2={{
                                 min: 0,
                                 formatter: numberFormatters.bytesZeroDecimalPlaces,
                                 metrics: ['worker_pool.' + pool + '.total_memory'],
                                 labels: ['Memory'],
                                 type: 'line'
                               }}/>
            </DashboardSection>

          </div>
        )}
      </div>
    );
  }
});

export default PhpFpmDashboard;
