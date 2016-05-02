import PureRenderMixin from 'react-addons-pure-render-mixin';
import {combineLatest} from 'reactive-observables';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {getSnapshot, setSelectedSnapshotId} from 'in-stores/snapshot';
import {getLabel, getIcon} from 'in-sdk/snapshot';
import * as tracking from 'in-services/tracking';
import {getPlural} from 'in-sdk/pluginName';
import connectTo from 'in-hoc/connectTo';

import Collapsible from '../Collapsible';
import List from '../List';

import './RelatedSnapshotList.less';


const block = 'in-related-snapshot-list';
const rpt = React.PropTypes;

export default connectTo(
  props => {
    return {
      snapshots: combineLatest(props.snapshotIds.map(id =>
          getSnapshot(id).startWith(null)
        ).toArray())
        // Do not show snapshots which are still loading
        .map(snapshots => snapshots.filter(s => s))
        // We will have lots of incremental updates. One update every few
        // milliseconds is enough.
        .throttle(100)
    };
  },
  React.createClass({
  displayName: 'RelatedSnapshotList',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    snapshotIds: irpt.setOf(React.PropTypes.string).isRequired,
    initiallyOpen: rpt.bool,
    onRenderItem: rpt.func,
    snapshots: rpt.array
  },

  render() {
    if (!this.props.snapshots || this.props.snapshots.size === 0) {
      return null;
    }

    const groups = this.getSnapshotsGroupedByPlugin();
    const groupPlugins = Object.keys(groups)
      .sort((a, b) => getPlural(a).localeCompare(getPlural(b)));

    return (
      <div>
        {groupPlugins.map(plugin =>
          <Collapsible key={plugin}
                       initiallyOpen={this.props.initiallyOpen}>
            <Collapsible.Header className={block + '__header'}>
              <div className={block + '__header'}>
                <img src={getIcon(plugin)}
                     alt='plugin icon'
                     className={block + '__plugin-icon'}/>
                {getPlural(plugin)}
              </div>
            </Collapsible.Header>
            <Collapsible.Content>
              <List>
                {groups[plugin].map(snapshot =>
                  <List.Item key={snapshot.get('id')}
                             onClick={() => this.select(snapshot)}>
                    {this.props.onRenderItem ?
                      this.props.onRenderItem(snapshot) :
                      getLabel(snapshot)
                    }
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
    setSelectedSnapshotId(snapshot.get('id'));
  },

  getSnapshotsGroupedByPlugin() {
    const grouping = {};

    this.props.snapshots.forEach(snapshot => {
      const plugin = snapshot.get('plugin');
      if (!(plugin in grouping)) {
        grouping[plugin] = [];
      }

      grouping[plugin].push(snapshot);
    });

    return grouping;
  }
}));
