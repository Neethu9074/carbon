import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import HeapSpacesTable from 'in-forge/plugins/nodeJsRuntimePlatform/Dashboard/HeapSpacesTable';
import * as numberFormatters from 'in-services/formatters/number';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';
import {Row, Col} from 'in-components/Grid/Grid';


const chartHeight = 150;

const NodejsDashboard = React.createClass({
  mixins: [
    PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: timeframeShape
  },

  render() {
    const timeframe = this.props.timeframe;
    const snapshot = this.props.snapshot;

    return (
      <div>
        <DashboardSection title='Memory Usage & GC Activity'>
          <Row>
            <Col cols={6}>
              <ChartWithLegend snapshot={snapshot}
                               timeframe={timeframe}
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
            </Col>
            <Col cols={6}>
              <ChartWithLegend snapshot={snapshot}
                               timeframe={timeframe}
                               height={chartHeight}
                               margins={{
                                 left: 90
                               }}

                               y1={{
                                 min: 0,
                                 formatter: numberFormatters.time,
                                 metrics: [
                                   'gc.gcPause'
                                 ],
                                 labels: [
                                   'GC Pause'
                                 ],
                                 type: 'stackedArea'
                               }}/>
            </Col>
          </Row>
        </DashboardSection>

        <HeapSpacesTable snapshot={snapshot}
                         timeframe={timeframe} />

        <DashboardSection title='Event Loop'>
          <ChartWithLegend snapshot={snapshot}
                           timeframe={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 90
                           }}

                           y1={{
                             min: 0,
                             formatter: numberFormatters.time,
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
