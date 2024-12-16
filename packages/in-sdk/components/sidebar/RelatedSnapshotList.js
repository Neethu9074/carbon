/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Collapsible } from '@instana/components';

import { ClickableSnapshotListItem, ClickableList } from 'in-sdk/components/sidebar/ClickableList';
import { useSegmentTracker } from 'in-infrastructure/tracking/tracking';
import { compareIgnoreCase } from 'in-services/util/string';
import PluginIcon from 'in-components/PluginIcon';
import { getSnapshots } from 'in-stores/snapshot';
import { getPluginName } from 'in-sdk/pluginName';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import locals from './RelatedSnapshotList.mless';

export default connectTo(
  props => {
    return {
      // on large numbers, the component will be drawn multiple time a sec which leads to a hanging UI.
      // to avoid this, debounce the stream to give the UI enough time to render stuff.
      snapshots: getSnapshots(props.snapshotIds).debounce(1000)
    };
  },
  function RelatedSnapshotList({ initiallyOpen, snapshots }) {
    const { trackSidebarRelatedEntitiesExpanded, trackSidebarRelatedEntitiesClicked } = useSegmentTracker();

    if (!snapshots || snapshots.size === 0) {
      return null;
    }
    const groups = getSnapshotsGroupedByPlugin(snapshots);

    const groupPlugins = Object.keys(groups).sort((a, b) =>
      compareIgnoreCase(getPluginName(a, groups[a].length), getPluginName(b, groups[b].length))
    );

    return (
      <div>
        {groupPlugins.map(plugin => (
          <div key={plugin}>
            <Collapsible initiallyOpen={initiallyOpen} onOpen={() => trackSidebarRelatedEntitiesExpanded({ plugin })}>
              <Collapsible.Header>
                <div className={locals.snapshotListHeader}>
                  <>
                    {getUniqueSnapshotCollection(groups[plugin]).map((snapshot, i) => (
                      <PluginIcon key={i} className={locals.snapshotListPluginIcon} snapshot={snapshot} />
                    ))}
                  </>

                  <span>
                    {getPluginName(plugin, groups[plugin].length)} ({groups[plugin].length})
                  </span>
                </div>
              </Collapsible.Header>
              <Collapsible.Content>
                <ClickableList>
                  {groups[plugin]
                    .sort((snapshotA, snapshotB) => compareIgnoreCase(getLabel(snapshotA), getLabel(snapshotB)))
                    .map(snapshot => (
                      <ClickableSnapshotListItem
                        key={snapshot.get('id')}
                        snapshotId={snapshot.get('id')}
                        onClick={() => {
                          trackSidebarRelatedEntitiesClicked({ plugin });
                        }}
                      />
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

function getUniqueSnapshotCollection(snapshots) {
  if (!snapshots) {
    return [];
  }

  const map = new Map();
  for (const snapshot of snapshots) {
    map.set(snapshot.get('plugin'), snapshot);
  }
  return Array.from(map.values());
}
