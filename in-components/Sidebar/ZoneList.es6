import _ from 'lodash';
import irpt from 'react-immutable-proptypes';
import React from 'react/addons';
import {combineLatest} from 'reactive-observables';

import {getColor} from 'in-sdk/zones';
import {getZone} from 'in-sdk/zones';
import * as viewStore from 'in-services/stores/view';

import enhance from '../hoc/enhance';
import Collapsible from '../Collapsible';
import SnapshotList from './SnapshotList';

import './ZoneList.less';

const rpt = React.PropTypes;
const block = 'in-sidebar-zone-list';

const ZoneList = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshots: irpt.list.isRequired,
    highlightedSnapshot: irpt.map,
    snapshotsWiredToHighlightedSnapshot: irpt.map.isRequired,

    viewStructure: rpt.array,
    groupIds: rpt.array,
    groups: rpt.array,
    zones: rpt.array
  },

  statics: {
    createObservables() {
      const groups = viewStore.viewStructure.map(structure => {
          return structure.map(s => s.group).filter(s => !!s);
        });

      const groupIds = groups.map(groupCoordinates => {
        return groupCoordinates.map(g => g.get('id'));
      });

      const zones = groups.transform({
          emitLatestOnSubscribe: true,

          transform(groupCoordinates) {
            return combineLatest(groupCoordinates.map(getZone));
          }
        });

      return {
        viewStructure: viewStore.viewStructure,
        groupIds,
        groups,
        zones
      };
    }
  },

  render() {
    const groupIdToZoneMapping = {};
    this.props.groupIds.forEach((groupId, i) => {
      groupIdToZoneMapping[groupId] = this.props.zones[i];
    });

    const zoneToSnapshotMapping = {};
    this.props.viewStructure.forEach(nodeStructure => {
      let zone;
      if (nodeStructure.group) {
        const groupId = nodeStructure.group.get('id');
        zone = groupIdToZoneMapping[groupId];
      } else {
        zone = 'undefined';
      }

      if (zone in zoneToSnapshotMapping) {
        zoneToSnapshotMapping[zone].push(nodeStructure);
      } else {
        zoneToSnapshotMapping[zone] = [nodeStructure];
      }
    });

    let zones = this.props.zones.slice();
    if ('undefined' in zoneToSnapshotMapping) {
      zones.push('undefined');
    }
    zones = _.uniq(zones.sort(), true);

    const snapshots = {};
    this.props.snapshots.forEach(function(snapshot) {
      const zone = getZone(snapshot);
      if (zone in snapshots) {
        snapshots[zone].push(snapshot);
      } else {
        snapshots[zone] = [snapshot];
      }
    });
    // const zones = this.props.zones.sort();

    return (
      <div className={block}>
        <h1 className={block + '__label'}>Zones</h1>
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

export default enhance(ZoneList);
