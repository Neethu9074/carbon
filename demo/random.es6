'use strict';

import React from 'react';
import observableGenerator from 'rx-observable-generator';
import PieChart from '../src';

export default function init() {
  const numberGenerator = observableGenerator.createDeviatingGenerator(
    10,
    10,
    Math.floor
  );
  const datasource = observableGenerator.createObservable({
    frequency: 1000,
    timeframe: 5000,
    min: 0,
    max: 100,
    numberGenerator
  });

  React.render(
    <PieChart width="500"
              holePercentage={0.5}
              datasource={datasource}/>,
    document.body
  );
}
