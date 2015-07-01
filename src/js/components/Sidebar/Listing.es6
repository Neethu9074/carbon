/*global require:false*/

'use strict';

import Immutable from 'immutable';
import React from 'react/addons';

import {Tabs, Tab} from 'instana-ui-components/Tabs';
import {create} from 'instana-ui-services/conveyer';
import SnapshotConveyer from 'instana-ui-services/conveyer/SnapshotConveyer';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import * as selectedSnapshotStore from 'instana-ui-services/stores/selectedSnapshot';
import * as highlightedSnapshotStore from 'instana-ui-services/stores/highlightedSnapshot';
import {getIssueCountSummary} from 'instana-ui-services/issueTracker';
import {sort} from 'instana-ui-sdk/sorting';

import './Listing.less';

const rpt = React.PropTypes;
const noWiredSnapshots = Immutable.Map({
  incoming: Immutable.Set(),
  outgoing: Immutable.Set()
});

const block = 'in-sidebar-listing';
const SidebarListing = React.createClass({
  mixins: [React.addons.PureRenderMixin, SubscriptionMixin],

  propTypes: {
    pluginId: rpt.string.isRequired
  },

  getInitialState() {
    return {
      snapshots: Immutable.List(),
      selectedSnapshot: null,
      highlightedSnapshot: null,
      snapshotsWiredToHighlightedSnapshot: noWiredSnapshots,
      issueSummary: null
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
      getIssueCountSummary()
        .subscribe(issueCountSummary => this.setState({issueCountSummary}))
    );
  },


  render() {
    if (this.state.selectedSnapshot) {
      return this.renderSnapshotDetails();
    }

    let dangerCount = 0;
    let warningCount = 0;

    if (this.state.issueCountSummary) {
      dangerCount = this.state.issueCountSummary.get('danger');
      warningCount = this.state.issueCountSummary.get('warning');
    }

    return (
      <Tabs blockIdentifier={block}>
        <Tab title={String(this.state.snapshots.size)}
             modifier='listing'>
          {this.renderSnapshotListing()}
        </Tab>
        <Tab title={String(dangerCount)}
             modifier='danger'>
          danger yo!
        </Tab>
        <Tab title={String(warningCount)}
             modifier='warning'>
          Warnings yo!
        </Tab>
      </Tabs>
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

export default SidebarListing;
