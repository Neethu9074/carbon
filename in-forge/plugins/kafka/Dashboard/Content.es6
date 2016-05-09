import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';


const chartHeight = 200;

const KafkaDashboard = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: timeframeShape
  },

  render() {
    const timeframe = this.props.timeframe;
    const snapshot = this.props.snapshot;

    return (
      <div>
        <DashboardSection title='Broker Traffic'>
          <ChartWithLegend snapshot={snapshot}
                 timeframe={timeframe}
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
        <DashboardSection title='Request Latency'>
          <ChartWithLegend snapshot={snapshot}
                 timeframe={timeframe}
                 height={chartHeight}
                 margins={{
                   left: 80
                 }}
                 y1={{
                   formatter: bytesZeroDecimalPlaces,
                   tooltipFormatter: bytesTwoDecimalPlaces,
                   metrics: [
                     'broker.totalTimeProduce',
                     'broker.totalTimeFetchConsumer',
                     'broker.totalTimeFetchFollower'
                   ],
                   labels: [
                     'Produce',
                     'Fetch Consumer',
                     'Fetch Follower'
                   ],
                   type: 'line'
                 }}/>
        </DashboardSection>
        <DashboardSection title='Requests per Second'>
          <ChartWithLegend snapshot={snapshot}
                 timeframe={timeframe}
                 height={chartHeight}
                 margins={{
                   left: 80
                 }}
                 y1={{
                   formatter: bytesZeroDecimalPlaces,
                   tooltipFormatter: bytesTwoDecimalPlaces,
                   metrics: [
                     'broker.produceRequests',
                     'broker.fetchConsumerRequests',
                     'broker.fetchFollowerRequests'
                   ],
                   labels: [
                     'Produce',
                     'Fetch Consumer',
                     'Fetch Follower'
                   ],
                   type: 'line'
                 }}/>
        </DashboardSection>
        <DashboardSection title='Broker Failures'>
          <ChartWithLegend snapshot={snapshot}
                 timeframe={timeframe}
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
        <DashboardSection title='Broker state metrics'>
          <ChartWithLegend snapshot={snapshot}
                 timeframe={timeframe}
                 height={chartHeight}
                 margins={{
                   left: 80
                 }}
                 y1={{
                   formatter: bytesZeroDecimalPlaces,
                   tooltipFormatter: bytesTwoDecimalPlaces,
                   metrics: [
                     'broker.underReplicatedPartitions',
                     'broker.offlinePartitionsCount',
                     'broker.leaderElections',
                     'broker.uncleanLeaderElections',
                     'broker.isrShrinks',
                     'broker.isrExpansions',
                     'broker.activeControllerCount'
                   ],
                   labels: [
                     'Under-replicated Partitions',
                     'Offline Partitions',
                     'Leader Elections',
                     'Unclean Leader Elections',
                     'ISR Shrinks',
                     'ISR Expansions',
                     'Active controller count'
                   ],
                   type: 'line'
                 }}/>
        </DashboardSection>
        <DashboardSection title='Average Idle Time Percentage'>
          <ChartWithLegend snapshot={snapshot}
                 timeframe={timeframe}
                 height={chartHeight}
                 margins={{
                   left: 80
                 }}
                 y1={{
                   formatter: bytesZeroDecimalPlaces,
                   tooltipFormatter: bytesTwoDecimalPlaces,
                   metrics: [
                     'broker.networkProcessorIdle',
                     'broker.requestHandlerIdle'
                   ],
                   labels: [
                     'Network Processor',
                     'Request Handler'
                   ],
                   type: 'line'
                 }}/>
        </DashboardSection>
        <DashboardSection title='Partitions'>
          <ChartWithLegend snapshot={snapshot}
                 timeframe={timeframe}
                 height={chartHeight}
                 margins={{
                   left: 80
                 }}
                 y1={{
                   formatter: bytesZeroDecimalPlaces,
                   tooltipFormatter: bytesTwoDecimalPlaces,
                   metrics: [
                     'broker.partitionCount'
                   ],
                   labels: [
                     'Count'
                   ],
                   type: 'line'
                 }}/>
        </DashboardSection>
        <DashboardSection title='Broker Messages In'>
          <ChartWithLegend snapshot={snapshot}
                 timeframe={timeframe}
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
                 timeframe={timeframe}
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
