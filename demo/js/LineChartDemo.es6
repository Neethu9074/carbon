/*eslint-disable no-prompt, no-alert*/

'use strict';

import React from 'react';
import LineChart from '../../LineChart';
import {create} from 'reactive-observables';
import Immutable from 'immutable';
import d3 from 'd3';

const commasFormatter = d3.format(',.0f');
const yAxisTickFormatter = d => commasFormatter(d * 100) + '%';

let running = true;

const LineChartDemo = React.createClass({
  getInitialState() {
    return {
      width: 700,
      height: 280,
      type: 'line',
      datasources: [
        createObservable({min: 0, max: 1, numberOfValues: 30}),
        createObservable({
          min: 0.2,
          max: 0.3,
          numberOfValues: 30,
          frequency: 300
        })
      ]
    };
  },

  render() {
    return (
      <div>
        <button type='button' onClick={this.changeDimensions}>
          Change chart dimensions
        </button>
        <button type='button' onClick={this.startStop}>
          Start / Stop
        </button>
        <button type='button' onClick={this.drawAreaChart}>
          Draw area chart
        </button>
        <br />
        <LineChart datasources={this.state.datasources}
                   width={this.state.width}
                   height={this.state.height}
                   type={this.state.type}
                   yAxisTickFormatter={yAxisTickFormatter}
                   valueTransformer={d => d * 0.5} />
      </div>
    );
  },

  changeDimensions() {
    this.setState({
      width: parseInt(prompt('New width', this.state.width), 10),
      height: parseInt(prompt('New height', this.state.height), 10)
    });
  },

  drawAreaChart() {
    this.setState({
      type: 'area'
    });
  },

  startStop() {
    running = !running;
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
        if (!running) {
          return;
        }
        data.values.shift();
        const latestTime = data.values[data.values.length - 1][0];
        const newValue = [latestTime + 300000, numberGenerator()];
        data.values.push(newValue);
        data.values = data.values.slice(
          data.length - numberOfValues,
          data.length
        );
        observable.emit(data);
      }, 500);
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
