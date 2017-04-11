import React from 'react';

import { ClickableSnapshotListItem, ClickableList } from 'in-sdk/components/sidebar/ClickableList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import PluginIcon from 'in-components/PluginIcon';
import { getSnapshots } from 'in-stores/snapshot';
import { getPlural } from 'in-sdk/pluginName';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import './RelatedSnapshotList.less';

const block = 'in-related-snapshot-list';

export default connectTo(
  props => {
    return {
      // on large numbers, the component will be drawn multiple time a sec which leads to a hanging UI.
      // to avoid this, debounce the stream to give the UI enough time to render stuff.
      snapshots: getSnapshots(props.snapshotIds).debounce(1000)
    };
  },
  function RelatedSnapshotList({ initiallyOpen, onRenderItem, snapshots }) {
    if (!snapshots || snapshots.size === 0) {
      return null;
    }
    const groups = getSnapshotsGroupedByPlugin(snapshots);
    const groupPlugins = Object.keys(groups).sort((a, b) => getPlural(a).localeCompare(getPlural(b)));

    return (
      <div>
        {groupPlugins.map(plugin => (
          <div key={plugin}>
            <Separator />

            <Collapsible initiallyOpen={initiallyOpen}>
              <Collapsible.Header className={block + '__header'}>
                <div className={block + '__header'}>
                  <PluginIcon className={block + '__plugin-icon'} snapshot={groups[plugin][0]} />
                  <span>
                    {getPlural(plugin)} ({groups[plugin].length})
                  </span>
                </div>
              </Collapsible.Header>
              <Collapsible.Content>
                <ClickableList>
                  {groups[plugin].sort().map(snapshot => (
                    <ClickableSnapshotListItem key={snapshot.get('id')} snapshotId={snapshot.get('id')}>
                      {onRenderItem ? onRenderItem(snapshot) : getLabel(snapshot)}
                    </ClickableSnapshotListItem>
                  ))}
                </ClickableList>
              </Collapsible.Content>
            </Collapsible>
          </div>
        ))}
      </div>
    );
  }
);

function getSnapshotsGroupedByPlugin(snapshots) {
  const grouping = {};

  snapshots.forEach(snapshot => {
    const plugin = snapshot.get('plugin');
    if (!(plugin in grouping)) {
      grouping[plugin] = [];
    }

    grouping[plugin].push(snapshot);
  });

  return grouping;
}
