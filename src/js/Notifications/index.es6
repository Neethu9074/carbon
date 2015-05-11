'use strict';

import './index.less';

import React from 'react';
import {create} from 'instana-ui-services/conveyer';
import SnapshotConveyer from 'instana-ui-services/conveyer/SnapshotConveyer';
import ConveyerMixin from 'instana-ui-services/conveyer/ConveyerMixin';
import {extractId, getIdString} from 'instana-ui-services/util/snapshots';
import * as constants from 'instana-ui-forge/constants';
import {sort} from 'instana-ui-sdk/sorting';

const Notifications = React.createClass({
  mixins: [ConveyerMixin],

  getInitialState() {
    return {
      snapshots: null
    };
  },

  componentDidMount() {
    const pluginId = constants.plugins.os;
    this.addSubscription(
      create(SnapshotConveyer, {pluginId})
      .map(sort)
      .subscribe(snapshots => this.setState({snapshots})
      )
    );
  },

  render() {
    const snapshots = this.state.snapshots;
    if (snapshots === null || snapshots.size === 0) {
      return null;
    }

    return (
      <div className="in-notifications">
        {snapshots.map(snapshot =>
          <div onClick={this.onNotificationClick.bind(this, snapshot)}
               key={getIdString(snapshot)}>
            {snapshot.get('hostId')}
          </div>
        ).toJS()}
      </div>
    );
  },

  onNotificationClick(snapshot) {
    this.props.onClick(extractId(snapshot));
  }
});

export default Notifications;
