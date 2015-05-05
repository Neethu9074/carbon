'use strict';

import React from 'react';
import {create} from 'instana-ui-services/conveyer';
import SnapshotConveyer from 'instana-ui-services/conveyer/SnapshotConveyer';
import ConveyerMixin from 'instana-ui-services/conveyer/ConveyerMixin';
import * as constants from 'instana-ui-forge/constants';
import {sort} from 'instana-ui-sdk/sorting';

import {Tabs, Tab} from '../components/Tabs';

const Overview = React.createClass({
  mixins: [ConveyerMixin],

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
      <div className="in-sidebar-overview">
        <Tabs>
          <Tab title="Servers">
            <ul>
              {this.state.snapshots.map(snapshot =>
                <li key={snapshot.get('hostId')}>
                  {snapshot.get('hostId')}
                </li>
              )}
            </ul>
          </Tab>
          <Tab title="Services">Services...</Tab>
        </Tabs>
      </div>
    );
  }
});

export default Overview;
