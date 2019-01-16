import React from 'react';

import PodStatusIcon from 'in-kubernetes/Dashboards/commonComponents/PodStatusIcon';

import locals from './PodStatus.mless';

export default function PodStatus({ status }) {
  return (
    <div className={locals.statusWrapper}>
      <PodStatusIcon status={status} />
      <span className={locals.statusLabel}>{status}</span>
    </div>
  );
}
