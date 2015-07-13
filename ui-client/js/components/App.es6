'use strict';

import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import {RouteHandler, Navigation} from 'react-router';

import Map from 'instana-ui-map';
import Issues from './Issues';
import Lettering from 'instana-ui-components/Lettering';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import * as selectedSnapshotStore from 'instana-ui-services/stores/selectedSnapshot';
import * as constants from 'instana-ui-forge/constants';

import ConnectionStatus from './ConnectionStatus';
import Sidebar from './Sidebar';
// import SearchBar from './SearchBar';

import './App.less';

const rpt = React.PropTypes;

const App = React.createClass({
  mixins: [
    IntlMixin,
    SubscriptionMixin,
    React.addons.PureRenderMixin,
    Navigation
  ],

  propTypes: {
    state: rpt.object.isRequired
  },

  getInitialState() {
    return {
      selectedSnapshot: null,
      pluginId: constants.plugins.os
    };
  },

  componentDidMount() {
    this.addSubscription(
      selectedSnapshotStore.selectedSnapshot.subscribe(selectedSnapshot => {
        this.setState({
          selectedSnapshot
        });
      })
    );
  },

  render() {
    const hasChildren = this.props.state.routes.length > 1;

    return (
      <div>
        <Lettering className='in-root-lettering' />

        <div style={{display: hasChildren ? 'none' : 'block'}}>
          <Map pluginId={this.state.pluginId} />

          <Sidebar pluginId={this.state.pluginId} />
        </div>

        <Issues />
        <RouteHandler/>
        <ConnectionStatus />
      </div>
    );
  }

});

export default App;
