import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {getColor} from 'in-sdk/zones';
import {getZone} from 'in-sdk/zones';

import Collapsible from '../Collapsible';
import SnapshotList from './SnapshotList';

import './ZoneList.less';

const block = 'in-sidebar-zone-list';

const ZoneList = React.createClass({
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
              <SnapshotList snapshots={snapshots[zone]}
                            snapshotsWiredToHighlightedSnapshot={this.props.snapshotsWiredToHighlightedSnapshot}
                            highlightedSnapshot={this.props.highlightedSnapshot}/>
            </Collapsible.Content>
          </Collapsible>
        )}
      </div>
    );
  }
});

export default ZoneList;
