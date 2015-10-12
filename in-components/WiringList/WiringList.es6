import React from 'react/addons';
import irpt from 'react-immutable-proptypes';
import {Navigation} from 'react-router';
import * as ro from 'reactive-observables';

import {getLayers} from 'in-services/wiring';
import {getLabel, getIcon} from 'in-sdk/snapshot';
import {getFullSnapshot} from 'in-services/snapshots';
import {getPlural} from 'in-sdk/pluginName';
import * as tracking from 'in-services/tracking';

import List from '../List';
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
    wiring: React.PropTypes.array
  },

  statics: {
    createObservables(props) {
      return {
        wiring: getLayers(props.snapshot).transform({
          emitLatestOnSubscribe: true,

          transform(layers) {
            return ro.combineLatest(layers.map(getFullSnapshot));
          }
        })
      };
    }
  },

  render() {
    if (this.props.wiring == null || this.props.wiring.size === 0) {
      return null;
    }

    const groups = this.getSnapshotsGroupedByPluginId();
    const groupPluginIds = Object.keys(groups)
      .sort((a, b) => getPlural(a).localeCompare(getPlural(b)));

    return (
      <div>
        {groupPluginIds.map(pluginId =>
          <Collapsible key={pluginId}>
            <Collapsible.Header className={block + '__header'}>
              <div className={block + '__header'}>
                <img src={getIcon(pluginId)}
                     alt='plugin icon'
                     className={block + '__plugin-icon'}/>
                {getPlural(pluginId)}
              </div>
            </Collapsible.Header>
            <Collapsible.Content>
              <List>
                {groups[pluginId].map(snapshot =>
                  <List.Item key={snapshot.get('id')}
                             onClick={() => this.navigateToDashboard(snapshot)}>
                    {getLabel(snapshot)}
                  </List.Item>
                )}
              </List>
            </Collapsible.Content>
          </Collapsible>
        )}
      </div>
    );
  },

  navigateToDashboard(snapshot) {
    tracking.trackEvent(tracking.events.navigateToAWiredComponentFromTheDashboard);
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
