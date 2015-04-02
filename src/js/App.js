'use strict';

import React from 'react/react';
import SignOutForm from './SignOutForm';
import RadialChart from 'instana-ui-radial-chart';
import LineChart from 'instana-ui-line-chart';

const App = React.createClass({
  render() {
    return (
      <div>
        <h1>Hello World!</h1>

        <RadialChart />

        <LineChart />

        <SignOutForm></SignOutForm>
      </div>
    );
  }
});

export default App;
