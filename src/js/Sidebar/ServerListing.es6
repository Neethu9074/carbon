'use strict';

import React from 'react/addons';
import {getZone} from 'instana-ui-sdk/zones';
import ServerItem from './ServerItem';

const ServerListing = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render() {
    // zone => snapshot[]
    const snapshots = {};
    this.props.snapshots.forEach(function(snapshot) {
      const zone = getZone(snapshot);
      if (zone in snapshots) {
        snapshots[zone].push(snapshot);
      } else {
        snapshots[zone] = [snapshot];
      }
    });
    const zones = Object.keys(snapshots).sort();

    return (
      <ul>
        {zones.map(zone =>
          <li key={zone}>
            {zone}
            <ul>
              {snapshots[zone].map(snapshot =>
                <ServerItem snapshot={snapshot} key={snapshot.get('hostId')} />
              )}
            </ul>
          </li>
        )}
      </ul>
    );
  }
});

export default ServerListing;
