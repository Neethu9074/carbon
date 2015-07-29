'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';
import {Navigation} from 'react-router';

import {getLabel, getIcon} from 'in-sdk/snapshot';
import {getIdString} from 'in-services/util/snapshots';
import {getWiringWithFullSnapshots} from 'in-services/wiring';
import {getPlural} from 'in-sdk/pluginName';

import Collapsible from '../Collapsible';
import enhance from '../hoc/enhance';

import './WiringList.less';

const block = 'in-wiring-list';

const WiringList = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    Navigation
  ],

  propTypes: {
    snapshot: irpt.map.isRequired,
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
        {Object.keys(groups).map(pluginId =>
          <Collapsible key={pluginId}>
            <Collapsible.Header className={block + '__header'}>
              <img src={getIcon(pluginId)}
                   alt='plugin icon'
                   className={block + '__plugin-icon'}/>
              {getPlural(pluginId)}
            </Collapsible.Header>
            <Collapsible.Content>
              <ul className={block}>
                {groups[pluginId].map(snapshot =>
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
