import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';
import irpt from 'react-immutable-proptypes';

import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';

const rpt = React.PropTypes;

const chartHeight = 200;

const KafkaDashboard = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    timeframe: rpt.number.isRequired,
    snapshot: irpt.map.isRequired
  },

  render() {
    const timeframe = this.props.timeframe;
    const snapshot = this.props.snapshot;

    return (
      <div>
        <DashboardSection title='Broker Traffic'>
          <ChartWithLegend snapshot={snapshot}
                 windowSize={timeframe}
                 height={chartHeight}
                 margins={{
                   left: 80
                 }}
                 y1={{
                   formatter: bytesZeroDecimalPlaces,
                   tooltipFormatter: bytesTwoDecimalPlaces,
                   metrics: [
                     'broker.bytesIn',
                     'broker.bytesOut',
                     'broker.bytesRejected'
                   ],
                   labels: [
                     'In',
                     'Out',
                     'Rejected'
                   ],
                   type: 'line'
                 }}/>
        </DashboardSection>
        <DashboardSection title='Broker Failures'>
          <ChartWithLegend snapshot={snapshot}
                 windowSize={timeframe}
                 height={chartHeight}
                 margins={{
                   left: 80
                 }}
                 y1={{
                   formatter: zeroDecimalPlaces,
                   tooltipFormatter: twoDecimalPlaces,
                   metrics: [
                     'broker.failedFetch',
                     'broker.failedProduce'
                   ],
                   labels: [
                     'Fetch',
                     'Produce'
                   ],
                   type: 'line'
                 }}/>
        </DashboardSection>
        <DashboardSection title='Broker Messages In'>
          <ChartWithLegend snapshot={snapshot}
                 windowSize={timeframe}
                 height={chartHeight}
                 margins={{
                   left: 80
                 }}
                 y1={{
                   formatter: zeroDecimalPlaces,
                   tooltipFormatter: twoDecimalPlaces,
                   metrics: [
                     'broker.messagesIn'
                   ],
                   labels: [
                     '#'
                   ],
                   type: 'line'
                 }}/>
        </DashboardSection>
        <DashboardSection title='Log Flushing'>
          <ChartWithLegend snapshot={snapshot}
                 windowSize={timeframe}
                 height={chartHeight}
                 margins={{
                   left: 80,
                   right: 40
                 }}
                 y1={{
                   formatter: zeroDecimalPlaces,
                   tooltipFormatter: twoDecimalPlaces,
                   metrics: [
                     'logflush.mean'
                   ],
                   labels: [
                     'Mean ms'
                   ],
                   type: 'line'
                 }}
                 y2={{
                   formatter: zeroDecimalPlaces,
                   tooltipFormatter: twoDecimalPlaces,
                   metrics: [
                     'logflush.inv'
                   ],
                   labels: [
                     'Flushes'
                   ],
                   type: 'line'
                 }}/>
        </DashboardSection>
      </div>
    );
  }
});

export default KafkaDashboard;
