'use strict';

import './App.less';

import React from 'react';
import Map from 'instana-ui-map';

import ConnectionStatus from './ConnectionStatus';
import Sidebar from './Sidebar';
import Header from './Header';

const App = React.createClass({

  render() {
    return (
      <div>
        <Header />
        <Map />
        <Sidebar />
        <ConnectionStatus />
      </div>
    );
  }

});

export default App;
