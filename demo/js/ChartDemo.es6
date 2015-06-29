'use strict';

import React from 'react/addons';
import * as ro from 'reactive-observables';

import Chart from '../../Chart';

const ChartDemo = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render() {
    const windowSize = 100;
    const datasources = [
      createRandomDataSource(windowSize),
      createRandomDataSource(windowSize),
      createRandomDataSource(windowSize),
      createRandomDataSource(windowSize),
      createRandomDataSource(windowSize)
    ];
    return (
      <div style={{display: 'inline-block'}}>
        <Chart type='stackedArea'
               width={1500}
               height={300}
               margins={{
                 top: 10,
                 right: 40,
                 bottom: 50,
                 left: 40
               }}
               seriesConfig={[
                 {label: 'cpu.total.user'},
                 {label: 'cpu.total.sys'},
                 {label: 'cpu.total.nice'},
                 {label: 'cpu.total.wait'},
                 {label: 'cpu.total.steal'}
               ]}
               windowSize={windowSize}
               datasources={datasources} />
      </div>
    );
  }
});

function createRandomDataSource(windowSize) {
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
