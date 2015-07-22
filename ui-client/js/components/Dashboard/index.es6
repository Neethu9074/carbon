/*global require: false*/
/*eslint-disable react/no-did-mount-set-state, react/no-did-update-set-state*/

'use strict';

import React from 'react';
import {State, Navigation} from 'react-router';
import Immutable from 'immutable';
import {on} from 'reactive-observables';

import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import * as selectedSnapshotStore from 'instana-ui-services/stores/selectedSnapshot';
import * as timelineStore from 'instana-ui-services/stores/timeline';

import './index.less';

const block = 'in-dashboard';

const Dashboard = React.createClass({
  mixins: [SubscriptionMixin, State, Navigation],

  statics: {
    willTransitionTo(transition, params) {
      const snapshotId = Immutable.Map({
        steadyId: params.steadyId,
        pluginId: params.pluginId,
        hostId: params.hostId
      });
      selectedSnapshotStore.select(snapshotId);
    }
  },

  getInitialState() {
    return {
      snapshot: null,
      timeframe: 0,
      width: -1
    };
  },

  componentDidMount() {
    this.addSubscription(
      selectedSnapshotStore.selectedSnapshot.subscribe(snapshot => {
        this.setState({snapshot});
      })
    );

    this.addSubscription(
      timelineStore.timeframe.subscribe(timeframe => {
        this.setState({timeframe});
      })
    );

    this.addSubscription(
      on(window, 'resize')
        .debounce(500)
        .subscribe(() => {
          this.setState({width: this.calculateChartWidth()});
        })
    );

    this.setState({width: this.calculateChartWidth()});
  },

  componentDidUpdate() {
    if (this.state.width === -1 && this.state.snapshot) {
      this.setState({width: this.calculateChartWidth()});
    }
  },

  calculateChartWidth() {
    const domNode = React.findDOMNode(this.refs.content);
    return parseInt(window.getComputedStyle(domNode).width, 10);
  },

  render() {
    return (
      <div className={block}>
        <button type='button'
                onClick={this.closeDashboard}
                className={block + '__close'}>
          x
        </button>
        <div className={block + '__content'} ref='content'>
          {this.state.snapshot ?
            this.renderDashboard()
          : <div>Loading...</div>}
        </div>

        <div className={block + '__sidebar'}>
          {this.state.snapshot ?
            this.renderSidebar()
          : <div>Loading...</div>}
        </div>
      </div>
    );
  },

  renderDashboard() {
    /*eslint-disable no-unused-vars*/
    const DashboardImpl = this.getForgeSpecificComponent('Content');
    return (<DashboardImpl snapshot={this.state.snapshot}
                           timeframe={this.state.timeframe}
                           width={this.state.width || 700} />);
    /*eslint-enable no-unused-vars*/
  },

  renderSidebar() {
    /*eslint-disable no-unused-vars*/
    const Sidebar = this.getForgeSpecificComponent('Sidebar');
    return (<Sidebar snapshot={this.state.snapshot}
                     timeframe={this.state.timeframe}
                     width={this.state.width || 700} />);
    /*eslint-enable no-unused-vars*/
  },

  getForgeSpecificComponent(name) {
    const snapshot = this.state.snapshot;
    return require('instana-ui-forge/' + snapshot.get('pluginId') + '/Dashboard/' + name + '.es6');
  },

  closeDashboard() {
    this.transitionTo('map');
  }

});

export default Dashboard;
