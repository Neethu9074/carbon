import React from 'react/addons';

import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import {getLabel, getIcon} from 'in-sdk/snapshot';
import * as tracking from 'in-services/tracking';
import {getPlural} from 'in-sdk/pluginName';

import Collapsible from '../Collapsible';
import List from '../List';

import './RelatedSnapshotList.less';

const block = 'in-related-snapshot-list';

const RelatedSnapshotList = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    snapshots: React.PropTypes.array.isRequired
  },

  render() {
    if (this.props.snapshots.length === 0) {
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
                             onClick={() => this.select(snapshot)}>
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

  select(snapshot) {
    tracking.events.navigateToAWiredComponentFromTheDashboard();
    selectedSnapshotStore.select(snapshot);
  },

  getSnapshotsGroupedByPluginId() {
    const grouping = {};

    this.props.snapshots.forEach(snapshot => {
      const pluginId = snapshot.get('pluginId');
      if (!(pluginId in grouping)) {
        grouping[pluginId] = [];
      }

      grouping[pluginId].push(snapshot);
    });

    return grouping;
  }
});

export default RelatedSnapshotList;
