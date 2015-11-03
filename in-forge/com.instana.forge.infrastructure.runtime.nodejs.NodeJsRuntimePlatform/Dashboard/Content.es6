import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import irpt from 'react-immutable-proptypes';

import * as numberFormatters from 'in-services/formatters/number';
import ChartWithLegend from 'in-components/ChartWithLegend';
import DashboardSection from 'in-components/DashboardSection';

const chartHeight = 150;
const rpt = React.PropTypes;

const NodejsDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired
  },

  render() {
    return (
      <div>
        <DashboardSection title='Memory Usage'>
          <ChartWithLegend snapshot={this.props.snapshot}
                           windowSize={this.props.timeframe}
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
          <ChartWithLegend snapshot={this.props.snapshot}
                           windowSize={this.props.timeframe}
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
          <ChartWithLegend snapshot={this.props.snapshot}
                           windowSize={this.props.timeframe}
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
