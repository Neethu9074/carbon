'use strict';

import './App.less'

import React from 'react/react';
import RadialChart from 'instana-ui-radial-chart';
import LineChart from 'instana-ui-line-chart';
import Map from 'instana-ui-map';
import observableGenerator from 'rx-observable-generator';
import SignOutForm from './SignOutForm';

const numberGenerator = observableGenerator.createDeviatingGenerator(
  50,
  25,
  Math.floor
);
const datasource = observableGenerator.createObservable(
  1000,
  60000,
  numberGenerator
);

const App = React.createClass({
  render() {
    return (
      <div>
        <Map />
      </div>
    );
  }
});

export default App;
