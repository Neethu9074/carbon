import React from 'react';

import PodPhaseIcon from 'in-kubernetes/Dashboards/commonComponents/PodPhaseIcon';

import locals from './PodPhase.mless';

export default function PodPhase({ status }) {
  return (
    <div className={locals.statusWrapper}>
      <PodPhaseIcon status={status} />
      <span className={locals.statusLabel}>{status}</span>
    </div>
  );
}
