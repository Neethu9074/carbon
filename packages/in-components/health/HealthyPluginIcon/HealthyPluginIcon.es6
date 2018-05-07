import React from 'react';

import { getHealthInfoAtFocusedMoment } from 'in-stores/events';
import { getColorBySeverity } from 'in-stores/events';
import { always } from 'in-services/fixedStreams';
import PluginIcon from 'in-components/PluginIcon';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

// TODO change callers: callers previous passed in time. They now need to pass in timeConfig
export default connectTo(
  props => {
    const snapshotId = props.snapshot ? props.snapshot.get('id') : props.snapshotId;
    const observables = {
      health: getHealthInfoAtFocusedMoment(snapshotId)
    };
    if (!props.plugin) {
      if (props.snapshot) {
        observables.plugin = always(props.snapshot.get('plugin'));
      } else {
        observables.plugin = getSnapshot(snapshotId, props.timeConfig).map(snapshot => snapshot.get('plugin'));
      }
    }
    return observables;
  },
  function HealthyEntityIcon({
    health,
    className,
    fallbackColor = '#fff',
    dimension = 16,
    snapshot,
    plugin,
    overrideSnapshot
  }) {
    const severity = health ? health.get('maxSeverity') : 0;
    const color = health && severity > 0 ? getColorBySeverity(severity) : fallbackColor;

    return (
      <PluginIcon
        className={className}
        dimension={dimension}
        color={color}
        snapshot={snapshot}
        plugin={plugin}
        overrideSnapshot={overrideSnapshot}
      />
    );
  }
);
