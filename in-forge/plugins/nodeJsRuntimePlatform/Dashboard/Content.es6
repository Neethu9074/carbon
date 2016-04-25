import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import * as numberFormatters from 'in-services/formatters/number';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ResponsiveTable from 'in-components/ResponsiveTable';
import classnames from 'in-services/util/classnames';
import {timeframeShape} from 'in-stores/timeline';
import {Row, Col} from 'in-components/Grid/Grid';
import Mtd from 'in-components/Mtd';


const chartHeight = 150;

const NodejsDashboard = React.createClass({
  mixins: [
    PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: timeframeShape
  },

  getInitialState() {
    return {
      selectedHeapSpace: null
    };
  },

  render() {
    const timeframe = this.props.timeframe;
    const snapshot = this.props.snapshot;

    const heapSpaces = snapshot.getIn(['data', 'heapSpaces']);

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

        {heapSpaces && heapSpaces.size > 0 ?
          <DashboardSection title='Heap Spaces'>
            {this.state.selectedHeapSpace ?
              <ChartWithLegend snapshot={snapshot}
                               timeframe={timeframe}
                               height={chartHeight}
                               margins={{
                                 left: 90
                               }}

                               y1={{
                                 min: 0,
                                 formatter: numberFormatters.bytesZeroDecimalPlaces,
                                 tooltipFormatter: numberFormatters.bytesTwoDecimalPlaces,
                                 metrics: [
                                   'heapSpaces.' + this.state.selectedHeapSpace + '.available',
                                   'heapSpaces.' + this.state.selectedHeapSpace + '.current',
                                   'heapSpaces.' + this.state.selectedHeapSpace + '.used',
                                   'heapSpaces.' + this.state.selectedHeapSpace + '.physical'
                                 ],
                                 labels: [
                                   'Available',
                                   'Current',
                                   'Used',
                                   'Physical'
                                 ],
                                 type: 'line'
              }}/>
            : null}

            <ResponsiveTable clickable={true}>
              <thead>
                <tr>
                  <th>Heap Space</th>
                  <th>Available</th>
                  <th>Current</th>
                  <th>Used</th>
                  <th>Physical</th>
                </tr>
              </thead>

              <tbody>
                {heapSpaces.toArray().map(heapSpace =>
                  <tr key={heapSpace}
                      onClick={() => this.setState({selectedHeapSpace: heapSpace})}
                      className={classnames({
                        'active': heapSpace === this.state.selectedHeapSpace
                      })}>
                    <td>{heapSpace}</td>
                    <Mtd metric={'heapSpaces.' + heapSpace + '.available'}
                         snapshot={snapshot}
                         formatter={numberFormatters.bytesTwoDecimalPlaces} />
                    <Mtd metric={'heapSpaces.' + heapSpace + '.current'}
                         snapshot={snapshot}
                         formatter={numberFormatters.bytesTwoDecimalPlaces} />
                    <Mtd metric={'heapSpaces.' + heapSpace + '.used'}
                         snapshot={snapshot}
                         formatter={numberFormatters.bytesTwoDecimalPlaces} />
                    <Mtd metric={'heapSpaces.' + heapSpace + '.physical'}
                         snapshot={snapshot}
                         formatter={numberFormatters.bytesTwoDecimalPlaces} />
                  </tr>
                )}
              </tbody>
            </ResponsiveTable>
          </DashboardSection>
        : null}

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
