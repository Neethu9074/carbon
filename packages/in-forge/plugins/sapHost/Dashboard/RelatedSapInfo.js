/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Collapsible } from '@instana/components';

import { ClickableSnapshotListItem, ClickableList } from 'in-sdk/components/sidebar/ClickableList';
import { useSegmentTracker } from 'in-infrastructure/tracking/tracking';
import { compareIgnoreCase } from 'in-services/util/string';
import { getSnapshots } from 'in-stores/snapshot';
import { getPluginName } from 'in-sdk/pluginName';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

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
    const [systemGrouping, instancegGrouping] = getSnapshotsGroupedByPlugin(snapshots);
    const systemGroupPlugins = Object.keys(systemGrouping).sort((a, b) =>
      compareIgnoreCase(getPluginName(a, systemGrouping[a].length), getPluginName(b, systemGrouping[b].length))
    );
    const instanceGroupPlugins = Object.keys(instancegGrouping).sort((a, b) =>
      compareIgnoreCase(getPluginName(a, instancegGrouping[a].length), getPluginName(b, instancegGrouping[b].length))
    );

    return pluginMap(
      systemGroupPlugins,
      systemGrouping,
      instanceGroupPlugins,
      instancegGrouping,
      initiallyOpen,
      trackSidebarRelatedEntitiesExpanded,
      trackSidebarRelatedEntitiesClicked
    );
  }
);

function pluginMap(
  systemGroupPlugins,
  systemGrouping,
  instanceGroupPlugins,
  instancegGrouping,
  initiallyOpen,
  trackSidebarRelatedEntitiesExpanded,
  trackSidebarRelatedEntitiesClicked
) {
  return (
    <div>
      {systemGroupPlugins.map(plugin => (
        <div key={plugin}>
          <Collapsible initiallyOpen={initiallyOpen} onOpen={() => trackSidebarRelatedEntitiesExpanded({ plugin })}>
            <Collapsible.Header>
              <span>
                {t('in-forge:plugins.sapSystem.label')} ({systemGrouping[plugin].length})
              </span>
            </Collapsible.Header>
            <Collapsible.Content>
              <ClickableList>
                {systemGrouping[plugin]
                  .sort((snapshotA, snapshotB) => compareIgnoreCase(getLabel(snapshotA), getLabel(snapshotB)))
                  .map(snapshot => (
                    <ClickableSnapshotListItem
                      key={snapshot.get('id')}
                      snapshotId={snapshot.get('id')}
                      onClick={() => trackSidebarRelatedEntitiesClicked({ plugin })}
                    />
                  ))}
              </ClickableList>
            </Collapsible.Content>
          </Collapsible>
        </div>
      ))}
      {instanceGroupPlugins.map(plugin => (
        <div key={plugin}>
          <Collapsible initiallyOpen={initiallyOpen} onOpen={() => trackSidebarRelatedEntitiesExpanded({ plugin })}>
            <Collapsible.Header>
              <span>
                {t('in-forge:plugins.sapInstance.label')} ({instancegGrouping[plugin].length})
              </span>
            </Collapsible.Header>
            <Collapsible.Content>
              <ClickableList>
                {instancegGrouping[plugin]
                  .sort((snapshotA, snapshotB) => compareIgnoreCase(getLabel(snapshotA), getLabel(snapshotB)))
                  .map(snapshot => (
                    <ClickableSnapshotListItem
                      key={snapshot.get('id')}
                      snapshotId={snapshot.get('id')}
                      onClick={() => trackSidebarRelatedEntitiesClicked({ plugin })}
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

function getSnapshotsGroupedByPlugin(snapshots) {
  const systemGrouping = {};
  const instancegrouping = {};

  snapshots.forEach(snapshot => {
    const plugin = snapshot.get('plugin');
    if (plugin.includes('Instance') && !(plugin in instancegrouping)) {
      instancegrouping[plugin] = [];
      instancegrouping[plugin].push(snapshot);
    }

    if (plugin.includes('System') && !(plugin in systemGrouping)) {
      systemGrouping[plugin] = [];
      systemGrouping[plugin].push(snapshot);
    }
  });
  return [systemGrouping, instancegrouping];
}
