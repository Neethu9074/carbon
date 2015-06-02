'use strict';

import './App.less';

import React from 'react';
import Map from 'instana-ui-map';

import ConnectionStatus from './ConnectionStatus';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const App = React.createClass({

  render() {
    return (
      <div>
        <Header />
        <ConnectionStatus />
        <Footer />
      </div>
    );
  }

});

export default App;
