'use strict';

import React from 'react/addons';
import {create} from 'instana-ui-services/conveyer';
import SnapshotConveyer from 'instana-ui-services/conveyer/SnapshotConveyer';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import * as constants from 'instana-ui-forge/constants';
import {sort} from 'instana-ui-sdk/sorting';

import ServerListing from './ServerListing';
import {Tabs, Tab} from 'instana-ui-components/Tabs';

const Overview = React.createClass({
  mixins: [SubscriptionMixin, React.addons.PureRenderMixin],

  getInitialState() {
    return {
      snapshots: []
    };
  },

  componentDidMount() {
    this.addSubscription(
      create(SnapshotConveyer, {pluginId: constants.plugins.os})
      .map(sort)
      .subscribe(snapshots => this.setState({snapshots}))
    );
  },

  render() {
    return (
      <Tabs>
        <Tab title="Servers">
          <ServerListing snapshots={this.state.snapshots} />
        </Tab>
        <Tab title="Services">Services...</Tab>
      </Tabs>
    );
  }

});

export default Overview;
