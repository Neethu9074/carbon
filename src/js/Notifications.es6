'use strict';

import './Notifications.less';

import React from 'react';
import {create} from 'instana-ui-services/conveyer';
import InventoryConveyer from 'instana-ui-services/conveyer/InventoryConveyer';
import ConveyerMixin from 'instana-ui-services/conveyer/ConveyerMixin';
import {extractId} from 'instana-ui-services/util/snapshots';

const Notifications = React.createClass({
  mixins: [ConveyerMixin],

  getInitialState() {
    return {
      snapshots: null
    };
  },

  componentDidMount() {
    this.addSubscription(
      create(InventoryConveyer).subscribe(
        snapshots => this.setState({snapshots})
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
          <div onClick={this.onNotificationClick.bind(this, snapshot)}>
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
