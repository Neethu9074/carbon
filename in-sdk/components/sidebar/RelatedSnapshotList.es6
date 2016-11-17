import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {ClickableSnapshotListItem, ClickableList} from 'in-sdk/components/sidebar/ClickableList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import {getLabel, getIcon} from 'in-sdk/snapshot';
import {getSnapshots} from 'in-stores/snapshot';
import {getPlural} from 'in-sdk/pluginName';
import connectTo from 'in-hoc/connectTo';

import './RelatedSnapshotList.less';


const block = 'in-related-snapshot-list';
const rpt = React.PropTypes;

export default connectTo(props => {
  return {
    snapshots: getSnapshots(props.snapshotIds)
  };
}, React.createClass({
  displayName: 'RelatedSnapshotList',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    snapshotIds: rpt.any.isRequired,
    initiallyOpen: rpt.bool,
    onRenderItem: rpt.func,
    snapshots: rpt.array
  },

  getDefaultProps() {
    return {
      seperate: true
    };
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
          <div key={plugin}>
            <Separator />

            <Collapsible initiallyOpen={this.props.initiallyOpen}>
              <Collapsible.Header className={block + '__header'}>
                <div className={block + '__header'}>
                  <img src={getIcon(plugin)}
                       alt='plugin icon'
                       className={block + '__plugin-icon'}/>
                  <span>
                    {getPlural(plugin)} ({groups[plugin].length})
                  </span>
                </div>
              </Collapsible.Header>
              <Collapsible.Content>
                <ClickableList>
                  {groups[plugin].sort().map(snapshot =>
                    <ClickableSnapshotListItem key={snapshot.get('id')}
                                               snapshotId={snapshot.get('id')}>
                      {this.props.onRenderItem ?
                        this.props.onRenderItem(snapshot) :
                        getLabel(snapshot)
                      }
                    </ClickableSnapshotListItem>
                  )}
                </ClickableList>
              </Collapsible.Content>
            </Collapsible>
          </div>
        )}
      </div>
    );
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
