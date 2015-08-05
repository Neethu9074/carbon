/*global require:false*/

'use strict';

import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import {RouteHandler, Navigation} from 'react-router';

import Map from 'in-map';
import Lettering from 'in-components/Lettering';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import * as constants from 'in-forge/constants';

import FeedbackBadge from './FeedbackBadge';
import Footer from './Footer';
import HelpDialog from './HelpDialog';
import NoNodesDialog from './NoNodesDialog';
import ConnectionStatus from './ConnectionStatus';
import Sidebar from './Sidebar';

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
          <FeedbackBadge />
        </div>

        <Footer />

        <RouteHandler />

        <NoNodesDialog pluginId={this.state.pluginId} />

        {this.props.state.query.help ?
          <HelpDialog id={this.props.state.query.help} />
        : null}

        {window.instana.config.environment === 'demo' ?
          this.renderDemoDialog()
        : null}

        <ConnectionStatus />
      </div>
    );
  },

  renderDemoDialog() {
    const DemoDialog = require('./DemoDialog');
    return <DemoDialog />;
  }
});

export default App;
