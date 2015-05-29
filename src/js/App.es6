'use strict';

import './App.less';

import React from 'react';
import Map from 'instana-ui-map';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import * as connection from 'instana-ui-services/connection';

import Sidebar from './Sidebar';
import Notifications from './Notifications';
import Toast from 'instana-ui-components/Toast';
import Lettering from 'instana-ui-components/Lettering';
import Header from './Header';

const App = React.createClass({
  mixins: [SubscriptionMixin],

  getInitialState() {
    return {
      systemMessage: null
    };
  },

  componentDidMount() {

    this.addSubscription(
      connection.emitter.on('closed').subscribe(() =>
        this.setState({
          systemMessage: 'Connection lost.'
        })
      )
    );

    this.addSubscription(
      connection.emitter.on('connected').subscribe(() =>
        this.setState({
          systemMessage: null
        })
      )
    );
  },

  render() {
    return (
      <div>
        <Header />
        <Notifications />

        <Map ref="map" />
        <Sidebar />

        <Toast action="Dismiss"
               onClick={() => this.setState({systemMessage: null})}>
          {this.state.systemMessage}
        </Toast>
      </div>
    );
  }

});

export default App;
