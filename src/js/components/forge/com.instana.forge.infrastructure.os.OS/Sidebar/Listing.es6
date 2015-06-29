'use strict';

import React from 'react/addons';
import {IntlMixin, FormattedHTMLMessage} from 'react-intl';
import irpt from 'react-immutable-proptypes';

import {getZone} from 'instana-ui-sdk/zones';
import {getColor} from 'instana-ui-sdk/zones';
import {getIdString} from 'instana-ui-services/util/snapshots';

import ServerItem from './Server';

import './Listing.less';

const Listing = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  propTypes: {
    snapshots: irpt.seq.isRequired,
    highlightedSnapshot: irpt.map.isRequired,
    snapshotsWiredToHighlightedSnapshot: irpt.seq.isRequired
  },

  render() {
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
      <div className='in-sidebar-server-listing'>
        <h1 className='in-sidebar-server-listing__header'>
          <FormattedHTMLMessage
            message={this.getIntlMessage('map.sidebar.serverListing.heading')}
            servers={this.props.snapshots.size || 0}
            zones={Object.keys(snapshots).length} />
        </h1>

        <ul className='in-sidebar-server-listing__zones'>
          {zones.map(zone =>
            <li key={zone} className='in-sidebar-server-listing__zone'>
              <h2 className='in-sidebar-server-listing__zone-label'
                  style={{color: getColor(zone)}}>
                {zone}

                <span className='in-sidebar-server-listing__server-count'
                      style={{backgroundColor: getColor(zone)}}>
                  {snapshots[zone].length}
                </span>
              </h2>

              <ul className='in-sidebar-server-listing__snapshots'>
                {snapshots[zone].map(snapshot =>
                  <ServerItem snapshot={snapshot}
                              key={getIdString(snapshot)}
                              highlighted={this.props.highlightedSnapshot === snapshot}
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
    const snapshotsWiredToHighlightedSnapshot = this.props.snapshotsWiredToHighlightedSnapshot;
    return snapshotsWiredToHighlightedSnapshot.get('incoming').contains(snapshot) ||
      snapshotsWiredToHighlightedSnapshot.get('outgoing').contains(snapshot);
  }
});

export default Listing;
