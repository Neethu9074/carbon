'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';
import {Navigation} from 'react-router';

import {getLabel} from 'instana-ui-sdk/snapshot';
import {getIdString} from 'instana-ui-services/util/snapshots';
import {getWiringWithFullSnapshots} from 'instana-ui-services/wiring';
import Collapsible from 'instana-ui-components/Collapsible';

import enhance from 'instana-ui-components/hoc/enhance';


const rpt = React.PropTypes;
const block = 'in-wiring-list';

const WiringList = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    Navigation
  ],

  propTypes: {
    snapshot: irpt.map.isRequired,
    targetPluginId: rpt.string.isRequired,
    wiring: irpt.set
  },

  statics: {
    createObservables(props) {
      return {
        wiring: getWiringWithFullSnapshots(props.snapshot)
      };
    }
  },

  render() {
    if (this.props.wiring == null || this.props.wiring.size === 0) {
      return null;
    }

    const groups = this.getSnapshotsGroupedByPluginId();
    return (
      <div>
        {Object.keys(groups).map(groupName =>
          <Collapsible key={groupName}>
            <Collapsible.Header>
              {groupName}
            </Collapsible.Header>
            <Collapsible.Content>
              <ul className={block}>
                {groups[groupName].map(snapshot =>
                  <li key={getIdString(snapshot)}
                      onClick={() => this.navigateToDashboard(snapshot)}>
                    {getLabel(snapshot)}
                  </li>
                )}
              </ul>
            </Collapsible.Content>
          </Collapsible>
        )}
      </div>
    );
  },

  navigateToDashboard(snapshot) {
    this.transitionTo(
      'dashboard',
      {
        pluginId: encodeURIComponent(snapshot.get('pluginId')),
        steadyId: encodeURIComponent(snapshot.get('steadyId')),
        hostId: encodeURIComponent(snapshot.get('hostId'))
      }
    );
  },

  getSnapshotsGroupedByPluginId() {
    const grouping = {};

    this.props.wiring.forEach(snapshot => {
      const pluginId = snapshot.get('pluginId');
      if (!(pluginId in grouping)) {
        grouping[pluginId] = [];
      }

      grouping[pluginId].push(snapshot);
    });

    return grouping;
  }
});

export default enhance(WiringList);
