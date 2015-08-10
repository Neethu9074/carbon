import Immutable from 'immutable';
import React from 'react/addons';

import * as highlightedSnapshotStore from 'in-services/stores/highlightedSnapshot';
import {getIssueCountSummary, getIssueSummary} from 'in-services/issueTracker';
import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import SnapshotConveyer from 'in-services/conveyer/SnapshotConveyer';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {Tabs, Tab} from 'in-components/Tabs';
import {create} from 'in-services/conveyer';
import {theme} from 'in-services/theme';
import {sort} from 'in-sdk/sorting';

import SeverityListing from './SeverityListing';
import MapStats from './MapStats';
import ZoneList from './ZoneList';
import Metrics from './Metrics';
import Details from './Details';
import Tags from './Tags';

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
          <Tab title='' modifier='metrics'>
            <Metrics/>
          </Tab>
          {__DEV__ ?
            <Tab title='render statistics' modifier='renderStats'>
              <MapStats />
            </Tab> : null}
          <Tab title='' modifier='tags'>
            <Tags snapshots={this.state.snapshots} />
          </Tab>
        </Tabs>
      </div>
    );
  }
});

export default SidebarListing;
