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
      ]
    };
  },

  render() {
    return (
      <div>
        <div onClick={this.chooseDimensions}>
          <button>Choose dimensions</button>
        </div>
        <Chart type='stackedArea'
               width={this.state.width}
               height={this.state.height}
               seriesConfig={[
                 {label: 'cpu.total.user'},
                 {label: 'cpu.total.sys'},
                 {label: 'cpu.total.nice'},
                 {label: 'cpu.total.wait'},
                 {label: 'cpu.total.steal'}
               ]}
               windowSize={windowSize}
               datasources={this.state.datasources} />
      </div>
    );
  },

  chooseDimensions() {
    this.setState({
      width: prompt('Width', 700),
      height: prompt('Height', 300)
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
