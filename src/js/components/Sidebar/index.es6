/*global require:false*/

'use strict';

import Immutable from 'immutable';
import React from 'react/addons';

import {create} from 'instana-ui-services/conveyer';
import SnapshotConveyer from 'instana-ui-services/conveyer/SnapshotConveyer';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import * as selectedSnapshotStore from 'instana-ui-services/stores/selectedSnapshot';
import * as highlightedSnapshotStore from 'instana-ui-services/stores/highlightedSnapshot';
import * as metricsStore from 'instana-ui-services/stores/metrics';
import {sort} from 'instana-ui-sdk/sorting';

import Metrics from './Metrics';
import FloatingFrame from './FloatingFrame';

import './index.less';

const rpt = React.PropTypes;
const noWiredSnapshots = Immutable.Map({
  incoming: Immutable.Set(),
  outgoing: Immutable.Set()
});

const Sidebar = React.createClass({

  mixins: [React.addons.PureRenderMixin, SubscriptionMixin],

  propTypes: {
    pluginId: rpt.string.isRequired
  },

  getInitialState() {
    return {
      snapshots: Immutable.List(),
      activeMetric: null,
      selectedSnapshot: null,
      highlightedSnapshot: null,
      snapshotsWiredToHighlightedSnapshot: noWiredSnapshots
    };
  },

  componentDidMount() {
    this.addSubscription(
      create(SnapshotConveyer, {pluginId: this.props.pluginId})
        .map(sort)
        .subscribe(snapshots => this.setState({snapshots}))
    );

    this.addSubscription(
      selectedSnapshotStore.selectedSnapshot.subscribe(selectedSnapshot =>
        this.setState({selectedSnapshot})
      )
    );

    this.addSubscription(
      highlightedSnapshotStore.highlightedSnapshot.subscribe(highlightedSnapshot =>
        this.setState({highlightedSnapshot})
      )
    );

    this.addSubscription(
      highlightedSnapshotStore.wiredSnapshots.subscribe(wiredSnapshots =>
        this.setState({
          snapshotsWiredToHighlightedSnapshot: wiredSnapshots
        })
      )
    );

    this.addSubscription(
      metricsStore.activeMetric.subscribe(activeMetric => {
        if (this.refs && this.refs.metrics) {
          this.refs.metrics.close();
        }
        this.setState({activeMetric});
      })
    );
  },

  render() {
    const activeMetric = this.state.activeMetric;
    return (
      <div className='in-sidebar'>
        <FloatingFrame icon='menue' title='Details'>
          {this.state.selectedSnapshot ?
            this.renderSnapshotDetails()
          : this.renderSnapshotListing()}
        </FloatingFrame>

        <FloatingFrame icon={activeMetric ? activeMetric.get('icon') : 'metrics'}
                       title={activeMetric ? activeMetric.get('longLabel') : 'Metrics'}
                       ref='metrics'>
          <Metrics />
        </FloatingFrame>
      </div>
    );
  },

  renderSnapshotDetails() {
    /*eslint-disable no-unused-vars*/
    const Details = this.getForgeSpecificComponent('Details');
    return <Details snapshot={this.state.selectedSnapshot} />;
    /*eslint-enable no-unused-vars*/
  },

  renderSnapshotListing() {
    /*eslint-disable no-unused-vars*/
    const Listing = this.getForgeSpecificComponent('Listing');
    return (<Listing snapshots={this.state.snapshots}
                     snapshotsWiredToHighlightedSnapshot={this.state.snapshotsWiredToHighlightedSnapshot}
                     selectedSnapshot={this.state.selectedSnapshot}
                     highlightedSnapshot={this.state.highlightedSnapshot} />);
    /*eslint-enable no-unused-vars*/
  },

  getForgeSpecificComponent(name) {
    return require('../forge/' + this.props.pluginId + '/Sidebar/' + name);
  }

});

export default Sidebar;
