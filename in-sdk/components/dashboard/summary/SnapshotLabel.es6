import React from 'react';

import { getLabel } from 'in-sdk/snapshot';

import './SnapshotLabel.less';

const block = 'in-dash-sum-snap-label';

export default function SnapshotLabel({ snapshot }) {
  return (
    <h1 className={block}>
      {getLabel(snapshot)}
    </h1>
  );
}
