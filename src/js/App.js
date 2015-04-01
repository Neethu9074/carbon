'use strict';

import React from 'react';
import SignOutForm from './SignOutForm';
import RadialChart from 'instana-ui-radial-chart';

const App = React.createClass({
  render() {
    return (
      <div>
        <h1>Hello World!</h1>

        <RadialChart />

        <SignOutForm></SignOutForm>
      </div>
    );
  }
});

export default App;
