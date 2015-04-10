'use strict';

import './App.less'

import React from 'react/react';
import Map from 'instana-ui-map';

const App = React.createClass({
  render() {
    return (
      <div>
        <Map onClick={alert} />
      </div>
    );
  }
});

export default App;
