'use strict';

import React from 'react/addons';
import {IntlMixin, FormattedHTMLMessage} from 'react-intl';
import Immutable from 'immutable';

import {getZone} from 'instana-ui-sdk/zones';
import {getColor} from 'instana-ui-sdk/zones';
import {sort} from 'instana-ui-sdk/sorting';
import * as constants from 'instana-ui-forge/constants';
import {getIdString, isIdEqual} from 'instana-ui-services/util/snapshots';
import {create} from 'instana-ui-services/conveyer';
import SnapshotConveyer from 'instana-ui-services/conveyer/SnapshotConveyer';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import * as highlightedSnapshotStore from 'instana-ui-services/stores/highlightedSnapshot';

import ServerItem from './ServerItem';

import './ServerListing.less';

const noWiredSnapshots = Immutable.Map({
  incoming: Immutable.Set(),
  outgoing: Immutable.Set()
});

const ServerListing = React.createClass({
  mixins: [SubscriptionMixin, React.addons.PureRenderMixin, IntlMixin],

  getInitialState() {
    return {
      snapshots: Immutable.List(),
      selectedSnapshot: null,
      highlightedSnapshot: null,
      snapshotsWiredToHighlightedSnapshot: noWiredSnapshots
    };
  },

  componentDidMount() {
    this.addSubscription(
      create(SnapshotConveyer, {pluginId: constants.plugins.os})
        .map(sort)
        .subscribe(snapshots => this.setState({snapshots}))
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
  },

  render() {
    const snapshots = {};
    this.state.snapshots.forEach(function(snapshot) {
      const zone = getZone(snapshot);
      if (zone in snapshots) {
        snapshots[zone].push(snapshot);
      } else {
        snapshots[zone] = [snapshot];
      }
    });
    const zones = Object.keys(snapshots).sort();

    return (
      <div className='in-sidebar-server-listing'>
        <h1 className='in-sidebar-server-listing__header'>
          <FormattedHTMLMessage
            message={this.getIntlMessage('map.sidebar.serverListing.heading')}
            servers={this.state.snapshots.size || 0}
            zones={Object.keys(snapshots).length} />
        </h1>

        <ul className="in-sidebar-server-listing__zones">
          {zones.map(zone =>
            <li key={zone} className="in-sidebar-server-listing__zone">
              <h2 className="in-sidebar-server-listing__zone-label"
                  style={{color: getColor(zone)}}>
                {zone}

                <span className="in-sidebar-server-listing__server-count"
                      style={{backgroundColor: getColor(zone)}}>
                  {snapshots[zone].length}
                </span>
              </h2>

              <ul className="in-sidebar-server-listing__snapshots">
                {snapshots[zone].map(snapshot =>
                  <ServerItem snapshot={snapshot}
                              key={getIdString(snapshot)}
                              highlighted={this.state.highlightedSnapshot === snapshot}
                              wired={this.isWired(snapshot)}/>
                )}
              </ul>
            </li>
          )}
        </ul>
      </div>
    );
  },

  isWired(snapshot) {
    const snapshotsWiredToHighlightedSnapshot = this.state.snapshotsWiredToHighlightedSnapshot;
    return snapshotsWiredToHighlightedSnapshot.get('incoming').contains(snapshot) ||
      snapshotsWiredToHighlightedSnapshot.get('outgoing').contains(snapshot);
  }
});

export default ServerListing;
