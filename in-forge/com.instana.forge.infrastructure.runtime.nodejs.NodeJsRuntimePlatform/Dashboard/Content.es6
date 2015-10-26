import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import irpt from 'react-immutable-proptypes';

import {formatBytes} from 'in-services/converters';
import ChartWithLegend from 'in-components/ChartWithLegend';
import DashboardSection from 'in-components/DashboardSection';

const chartHeight = 150;
const rpt = React.PropTypes;
const msFormatter = n => n + 'ms';

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
                             formatter: formatBytes,
                             tooltipFormatter: formatBytes,
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
                             formatter: msFormatter,
                             metrics: [
                               'gc.gcPause'
                             ],
                             labels: [
                               'GC duration per second in ms'
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
                             formatter: msFormatter,
                             metrics: [
                               'libuv.max',
                               'libuv.sum'
                             ],
                             labels: [
                               'Longest time spent in a single loop',
                               'Total time spent in loop per second'
                             ],
                             type: 'line'
                           }}/>
        </DashboardSection>
      </div>
    );
  }

});

export default NodejsDashboard;
