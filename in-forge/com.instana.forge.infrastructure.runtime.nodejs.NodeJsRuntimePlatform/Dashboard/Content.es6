import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import * as numberFormatters from 'in-services/formatters/number';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';

const chartHeight = 150;
const rpt = React.PropTypes;

const NodejsDashboard = React.createClass({
  mixins: [
    React.addons.PureRenderMixin],

  propTypes: {
    timeframe: rpt.number.isRequired,
    snapshot: irpt.map.isRequired
  },

  render() {
    const timeframe = this.props.timeframe;
    const snapshot = this.props.snapshot;

    return (
      <div>
        <DashboardSection title='Memory Usage'>
          <ChartWithLegend snapshot={snapshot}
                           windowSize={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 90,
                             right: 60
                           }}

                           y1={{
                             min: 0,
                             formatter: numberFormatters.bytesZeroDecimalPlaces,
                             tooltipFormatter: numberFormatters.bytesTwoDecimalPlaces,
                             metrics: [
                               'memory.rss',
                               'memory.heapUsed',
                               'gc.usedHeapSizeAfterGc'
                             ],
                             labels: [
                               'RSS',
                               'Heap Size',
                               'Heap Size After GC'
                             ],
                             type: 'line'
                           }}

                           y2={{
                             min: 0,
                             formatter: numberFormatters.twoDecimalPlaces,
                             metrics: [
                               'gc.minorGcs',
                               'gc.majorGcs'
                             ],
                             labels: [
                               '#Minor GCs',
                               '#Major GCs'
                             ],
                             type: 'point'
                           }}/>
        </DashboardSection>

        <DashboardSection title='GC Activity'>
          <ChartWithLegend snapshot={snapshot}
                           windowSize={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 90
                           }}

                           y1={{
                             min: 0,
                             formatter: numberFormatters.msTwoDecimalPlaces,
                             metrics: [
                               'gc.gcPause'
                             ],
                             labels: [
                               'GC Pause'
                             ],
                             type: 'stackedArea'
                           }}/>
        </DashboardSection>

        <DashboardSection title='Event Loop'>
          <ChartWithLegend snapshot={snapshot}
                           windowSize={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 90
                           }}

                           y1={{
                             min: 0,
                             formatter: numberFormatters.msTwoDecimalPlaces,
                             metrics: [
                               'libuv.max',
                               'libuv.sum',
                               'libuv.lag'
                             ],
                             labels: [
                               'Longest time spent in a single loop',
                               'Total time spent in loop',
                               'Event loop lag'
                             ],
                             type: 'line'
                           }}
                           y2={{
                             min: 0,
                             formatter: numberFormatters.zeroDecimalPlaces,
                             metrics: [
                               'libuv.num'
                             ],
                             labels: [
                               'Loops per second'
                             ],
                             type: 'line'
                           }}/>
        </DashboardSection>
      </div>
    );
  }
});

export default NodejsDashboard;
