'use strict';

import React from 'react/react';
import RadialChart from 'instana-ui-radial-chart';
import LineChart from 'instana-ui-line-chart';
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
        <h1>Hello World!</h1>

        <RadialChart />

        <LineChart datasource={datasource} />

        <SignOutForm></SignOutForm>
      </div>
    );
  }
});

export default App;
