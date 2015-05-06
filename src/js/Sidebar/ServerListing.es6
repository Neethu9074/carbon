'use strict';

import './ServerListing.less';

import React from 'react/addons';
import {getZone} from 'instana-ui-sdk/zones';
import {consts} from 'instana-ui-themes';

import ServerItem from './ServerItem';


const ServerListing = React.createClass({
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
      <ul className="in-sidebar-server-listing__zones">
        {zones.map((zone, i) =>
          <li key={zone} className="in-sidebar-server-listing__zone">
            <h2 className="in-sidebar-server-listing__zone-label"
                style={{color: consts.night.map.colors.zones[i]}}>
              {zone}
            </h2>
            <ul>
              {snapshots[zone].map(snapshot =>
                <ServerItem snapshot={snapshot}
                            key={snapshot.get('hostId')}/>
              )}
            </ul>
          </li>
        )}
      </ul>
    );
  }
});

export default ServerListing;
