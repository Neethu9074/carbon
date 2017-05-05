import React from 'react';

import { getHealthInfoAtFocusedMoment } from 'in-stores/events';
import { getColorBySeverity } from 'in-stores/events';
import PluginIcon from 'in-components/PluginIcon';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    const snapshotId = props.snapshot ? props.snapshot.get('id') : props.snapshotId;
    const observables = {
      health: getHealthInfoAtFocusedMoment(snapshotId)
    };
    if (!props.snapshot) {
      observables.snapshot = getSnapshot(snapshotId, props.time);
    }
    return observables;
  },
  function HealthyEntityIcon({ snapshot, health, className, fallbackColor = '#fff', dimension = 16 }) {
    const severity = health ? health.get('maxSeverity') : 0;
    const color = health && severity > 0 ? getColorBySeverity(severity) : fallbackColor;

    return <PluginIcon className={className} dimension={dimension} color={color} snapshot={snapshot} />;
  }
);
