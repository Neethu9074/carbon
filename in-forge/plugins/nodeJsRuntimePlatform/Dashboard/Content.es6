import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import HeapSpacesTable from 'in-forge/plugins/nodeJsRuntimePlatform/Dashboard/HeapSpacesTable';
import DashboardNotification from 'in-components/DashboardNotification';
import * as numberFormatters from 'in-services/formatters/number';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';
import {Row, Col} from 'in-components/Grid/Grid';


export default React.createClass({
  displayName: 'NodejsDashboard',

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
        {this.getNativeExtensionHint()}

        <DashboardSection title='Memory Usage & GC Activity'>
          <Row>
            <Col cols={6}>
              {this.renderGcMetrics()}
            </Col>
            <Col cols={6}>
              <ChartWithLegend snapshotId={snapshot.get('id')}
                               timeframe={timeframe}
                               height={150}
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
          {this.renderEventLoopMetrics()}
        </DashboardSection>
      </div>
    );
  },

  renderGcMetrics() {
    if (this.props.snapshot.getIn(['data', 'gc.statsSupported'])) {
      return (
        <ChartWithLegend snapshotId={this.props.snapshot.get('id')}
                         timeframe={this.props.timeframe}
                         height={150}
                         margins={{
                           left: 90,
                           right: 90
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
      );
    }

    return (
      <ChartWithLegend snapshotId={this.props.snapshot.get('id')}
                       timeframe={this.props.timeframe}
                       height={150}
                       margins={{
                         left: 90
                       }}

                       y1={{
                         min: 0,
                         formatter: numberFormatters.bytesZeroDecimalPlaces,
                         tooltipFormatter: numberFormatters.bytesTwoDecimalPlaces,
                         metrics: [
                           'memory.rss',
                           'memory.heapUsed'
                         ],
                         labels: [
                           'RSS',
                           'Heap Size'
                         ],
                         type: 'line'
                       }}/>
    );
  },


  renderEventLoopMetrics() {
    if (this.props.snapshot.getIn(['data', 'libuv.statsSupported'])) {
      return (
        <ChartWithLegend snapshotId={this.props.snapshot.get('id')}
                         timeframe={this.props.timeframe}
                         height={150}
                         margins={{
                           left: 90,
                           right: 90
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
      );
    }

    return (
      <ChartWithLegend snapshotId={this.props.snapshot.get('id')}
                       timeframe={this.props.timeframe}
                       height={150}
                       margins={{
                         left: 90
                       }}

                       y1={{
                         min: 0,
                         formatter: numberFormatters.time,
                         metrics: [
                           'libuv.lag'
                         ],
                         labels: [
                           'Event loop lag'
                         ],
                         type: 'line'
                       }}/>
    );
  },

  getNativeExtensionHint() {
    const libuvMonitoringSupported = this.props.snapshot.getIn(['data', 'libuv.statsSupported']);
    const gcMonitoringSupported =  this.props.snapshot.getIn(['data', 'gc.statsSupported']);

    if (libuvMonitoringSupported && gcMonitoringSupported) {
      return null;
    }

    const missingNativeExtensions = [];
    if (!libuvMonitoringSupported) {
      missingNativeExtensions.push('event loop');
    }

    if (!gcMonitoringSupported) {
      missingNativeExtensions.push('garbage collection');
    }

    return (
      <DashboardNotification type='info'>
        Native extensions could not be loaded for detailed{' '}
        <strong>{missingNativeExtensions.join(' and ')}</strong>{' '}monitoring. As a result, Instana
        can only show you a limited set of metrics. Please contact us for installation support or
        refer to the{' '}
        <a href='http://docs.instana.com/articles/instana-agent-nodejs.html'>
          Node.js sensor installation instructions
        </a>.
      </DashboardNotification>
    );
  }
});
