'use strict';

import './ServerListing.less';

import React from 'react/addons';
import {getZone} from 'instana-ui-sdk/zones';
import {getColor} from 'instana-ui-sdk/zones';
import {getIdString} from 'instana-ui-services/util/snapshots';
import {create} from 'instana-ui-services/conveyer';
import SnapshotConveyer from 'instana-ui-services/conveyer/SnapshotConveyer';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import * as constants from 'instana-ui-forge/constants';
import {sort} from 'instana-ui-sdk/sorting';
import {IntlMixin, FormattedHTMLMessage} from 'react-intl';

import ServerItem from './ServerItem';


const ServerListing = React.createClass({
  mixins: [SubscriptionMixin, React.addons.PureRenderMixin, IntlMixin],

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
    // zone => snapshot[]
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
            servers={this.state.snapshots.size}
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
                              key={getIdString(snapshot)}/>
                )}
              </ul>
            </li>
          )}
        </ul>
      </div>
    );
  }
});

export default ServerListing;
