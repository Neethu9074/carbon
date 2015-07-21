'use strict';

import Immutable from 'immutable';
import React from 'react/addons';

import {Tabs, Tab} from 'instana-ui-components/Tabs';
import {create} from 'instana-ui-services/conveyer';
import SnapshotConveyer from 'instana-ui-services/conveyer/SnapshotConveyer';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import * as selectedSnapshotStore from 'instana-ui-services/stores/selectedSnapshot';
import * as highlightedSnapshotStore from 'instana-ui-services/stores/highlightedSnapshot';
import {getIssueCountSummary, getIssueSummary} from 'instana-ui-services/issueTracker';
import {sort} from 'instana-ui-sdk/sorting';
import {theme} from 'instana-ui-services/theme';
import Metrics from './Metrics';
import Tags from './Tags';
import Details from './Details';
import SeverityListing from './SeverityListing';
import ZoneList from './ZoneList';

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
      issueSummary: null,
      issueCountSummary: null
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
      getIssueSummary()
        .subscribe(issueSummary => this.setState({issueSummary}))
    );

    this.addSubscription(
      getIssueCountSummary()
        .subscribe(issueCountSummary => this.setState({issueCountSummary}))
    );
  },


  render() {
    let dangerCount = 0;
    let warningCount = 0;

    if (this.state.issueCountSummary) {
      dangerCount = this.state.issueCountSummary.get('danger');
      warningCount = this.state.issueCountSummary.get('warning');
    }

    return (
      <div>
        {this.state.selectedSnapshot ?
          <Details snapshot={this.state.selectedSnapshot} />
        : null}
        <Tabs blockIdentifier={block}
              style={{display: this.state.selectedSnapshot ? 'none' : 'block'}}>
          <Tab title={String(this.state.snapshots.size)}
               modifier='listing'>
            <ZoneList snapshots={this.state.snapshots}
                      snapshotsWiredToHighlightedSnapshot={this.state.snapshotsWiredToHighlightedSnapshot}
                      selectedSnapshot={this.state.selectedSnapshot}
                      highlightedSnapshot={this.state.highlightedSnapshot} />
          </Tab>
          <Tab title='metrics' modifier='listing'>
            <Metrics/>
          </Tab>
          <Tab title='tags'
               modifier='listing'>
            <Tags snapshots={this.state.snapshots} />
          </Tab>
          <Tab title={String(dangerCount)}
               modifier='danger'>
            {this.state.issueSummary ?
              <SeverityListing heading='Critical Problems'
                               headingColor={theme.health.danger}
                               snapshots={this.state.snapshots}
                               snapshotIssueSummary={this.state.issueSummary.get('danger')}
                               snapshotsWiredToHighlightedSnapshot={this.state.snapshotsWiredToHighlightedSnapshot}
                               selectedSnapshot={this.state.selectedSnapshot}
                               highlightedSnapshot={this.state.highlightedSnapshot} />
            : ' ' }
          </Tab>
          <Tab title={String(warningCount)}
               modifier='warning'>
            {this.state.issueSummary ?
              <SeverityListing heading='Warnings'
                               headingColor={theme.health.warning}
                               snapshots={this.state.snapshots}
                               snapshotIssueSummary={this.state.issueSummary.get('warning')}
                               snapshotsWiredToHighlightedSnapshot={this.state.snapshotsWiredToHighlightedSnapshot}
                               selectedSnapshot={this.state.selectedSnapshot}
                               highlightedSnapshot={this.state.highlightedSnapshot} />
            : ' ' }
          </Tab>
        </Tabs>
      </div>
    );
  }
});

export default SidebarListing;
