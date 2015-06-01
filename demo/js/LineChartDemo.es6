'use strict';

import React from 'react';
import LineChart from '../../LineChart';
import {create} from 'reactive-observables';
import Immutable from 'immutable';

const LineChartDemo = React.createClass({
  render() {
    let datasources = [
      createObservable({min: 0, max: 100, numberOfValues: 30}),
      createObservable({min: 20, max: 30, numberOfValues: 30})
    ];
    return (
      <LineChart datasources={datasources} />
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
        const newValue = [latestTime + 1, numberGenerator()];
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
    initialValues.push([i, numberGenerator()]);
  }
  return initialValues;
}
