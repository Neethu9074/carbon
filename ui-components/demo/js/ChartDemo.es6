/*eslint-disable no-alert*/

'use strict';

import React from 'react/addons';
import * as ro from 'reactive-observables';

import Chart from '../../Chart';

const windowSize = 100;
const ChartDemo = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  getInitialState() {
    return {
      width: 700,
      height: 300,
      datasources: [
        createRandomDataSource(windowSize),
        createRandomDataSource(windowSize),
        createRandomDataSource(windowSize),
        createRandomDataSource(windowSize),
        createRandomDataSource(windowSize)
      ],
      y2Datasources: [
        createRandomDataSource(windowSize),
        createRandomDataSource(windowSize)
      ]
    };
  },

  render() {
    return (
      <div>
        <div onClick={this.chooseDimensions}>
          <button>Choose dimensions</button>
        </div>
        <Chart width={this.state.width}
               height={this.state.height}
               windowSize={windowSize}
               y1={{
                 tickFormatter(v) {
                   return v + 'x';
                 },
                 min: 0,
                 max: 5,
                 type: 'stackedArea',
                 datasources: this.state.datasources,
                 seriesConfig: [
                   {label: 'cpu.total.user'},
                   {label: 'cpu.total.sys'},
                   {label: 'cpu.total.nice'},
                   {label: 'cpu.total.wait'},
                   {label: 'cpu.total.steal'}
                 ]
               }}
               y2={{
                 tickFormatter(v) {
                   return v + 'y2';
                 },
                 type: 'line',
                 min: -5,
                 datasources: this.state.y2Datasources,
                 seriesConfig: [
                   {label: 'wtf / second'},
                   {label: 'omg / second'}
                 ]
               }}
               margins={{
                 right: 60
               }}/>
      </div>
    );
  },

  chooseDimensions() {
    this.setState({
      width: parseInt(prompt('Width', 700), 10),
      height: parseInt(prompt('Height', 300), 10)
    });
  }
});

function createRandomDataSource() {
  let intervalHandle;

  return ro.create({
    start(observable) {
      const initialData = [];
      for (let i = 0; i <= windowSize; i++) {
        initialData.push([i, Math.random()]);
      }
      observable.emit(initialData);

      let iterationCount = 1;
      intervalHandle = setInterval(() => {
        observable.emit([[windowSize + iterationCount++, Math.random()]]);
      }, 1000);
    },

    stop() {
      clearInterval(intervalHandle);
    }
  });
}

export default ChartDemo;
