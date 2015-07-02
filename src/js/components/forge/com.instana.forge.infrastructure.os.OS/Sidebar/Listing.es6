'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import Collapsible from 'instana-ui-components/Collapsible';
import {getZone} from 'instana-ui-sdk/zones';
import {getColor} from 'instana-ui-sdk/zones';
import {getIdString} from 'instana-ui-services/util/snapshots';

import ServerItem from './Server';

import './Listing.less';

const block = 'in-sidebar-server-listing';

const Listing = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshots: irpt.list.isRequired,
    highlightedSnapshot: irpt.map,
    snapshotsWiredToHighlightedSnapshot: irpt.map.isRequired
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
      <div className={block}>
        {zones.map(zone =>
          <Collapsible key={zone}>
            <Collapsible.Header style={{color: getColor(zone)}}
                                className={block + '__zone'}>
              <span className={block + '__server-count'}
                    style={{backgroundColor: getColor(zone)}}>
                {snapshots[zone].length}
              </span>

              {zone}
            </Collapsible.Header>

            <Collapsible.Content>
              <ul className='in-sidebar-server-listing__snapshots'>
                {snapshots[zone].map(snapshot =>
                  <ServerItem snapshot={snapshot}
                              key={getIdString(snapshot)}
                              highlighted={this.props.highlightedSnapshot === snapshot}
                              wired={this.isWired(snapshot)}/>
                )}
              </ul>
            </Collapsible.Content>
          </Collapsible>
        )}
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
