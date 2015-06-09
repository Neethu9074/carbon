'use strict';

import React from 'react';
import LineChart from '../../LineChart';
import {create} from 'reactive-observables';
import Immutable from 'immutable';
import d3 from 'd3';

const commasFormatter = d3.format(',.0f');

const LineChartDemo = React.createClass({
  render() {
    let datasources = [
      createObservable({min: 0, max: 1, numberOfValues: 30}),
      createObservable({min: 0.2, max: 0.3, numberOfValues: 30})
    ];

    const yAxisTickFormatter = d => commasFormatter(d * 100) + '%';

    return (
      <LineChart datasources={datasources}
                 width={700}
                 height={280}
                 yAxisTickFormatter={yAxisTickFormatter} />
    );
  }
});

export default LineChartDemo;

function createObservable({min, max, numberOfValues}) {
  let interval;

  const numberGenerator = createDeviatingGenerator(
    (max + min) / 2,
    (max + min) / 4
  );

  let data = {
    min,
    max,
    values: createInitialValues(numberOfValues, numberGenerator)
  };

  return create({
    emitLatestOnSubscribe: true,

    start(observable) {
      observable.emit(data);
      interval = setInterval(() => {
        data.values.shift();
        const latestTime = data.values[data.values.length - 1][0];
        const newValue = [latestTime + 300000, numberGenerator()];
        data.values.push(newValue);
        data.values = data.values.slice(
          data.length - numberOfValues,
          data.length
        );
        observable.emit(data);
      }, 1000);
    },

    stop() {
      clearInterval(interval);
    }
  });
}

function createDeviatingGenerator(mean, deviation, roundingFn) {
  roundingFn = roundingFn || (x => x);
  return function() {
    return roundingFn(mean - deviation + Math.random() * deviation * 2);
  };
}

function createInitialValues(numberOfValues, numberGenerator) {
  const initialValues = [];
  for (let i = 0; i < numberOfValues; i++) {
    initialValues.push([i * 300000, numberGenerator()]);
  }
  return initialValues;
}
