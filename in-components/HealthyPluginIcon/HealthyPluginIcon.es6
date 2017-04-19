import React from 'react';

import { getHealthInfoAtFocusedMoment } from 'in-stores/events';
import PluginIcon from 'in-components/PluginIcon';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { getHealthColorBySeverity } from 'in-services/health';

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
  function HealthyEntityIcon({ snapshot, health, className, fallbackColor = '#fff' }) {
    const severity = health.get('maxSeverity');
    const color = health && severity > 0 ? getHealthColorBySeverity(severity) : fallbackColor;

    return <PluginIcon className={className} dimension={16} color={color} snapshot={snapshot} />;
  }
);
