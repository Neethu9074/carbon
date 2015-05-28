'use strict';

import './ServerListing.less';

import React from 'react/addons';
import {getZone} from 'instana-ui-sdk/zones';
import {getColor} from 'instana-ui-sdk/zones';
import {getIdString} from 'instana-ui-services/util/snapshots';

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
        {zones.map(zone =>
          <li key={zone} className="in-sidebar-server-listing__zone">
            <h2 className="in-sidebar-server-listing__zone-label"
                style={{color: getColor(zone)}}>
              {zone}
            </h2>

            <ul className="in-sidebar-server-listing__snapshots">
              {snapshots[zone].map(snapshot =>
                <ServerItem snapshot={snapshot} key={getIdString(snapshot)}/>
              )}
            </ul>
          </li>
        )}
      </ul>
    );
  }
});

export default ServerListing;
