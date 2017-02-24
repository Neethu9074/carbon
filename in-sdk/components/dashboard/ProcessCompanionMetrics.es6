import React from 'react';

import CompanionMetrics from 'in-sdk/components/dashboard/CompanionMetrics';
import {getProcessCompanions} from 'in-stores/snapshot/graph';

export default function ProcessCompanionMetrics({snapshotId}) {
  return (
    <CompanionMetrics companions$={getProcessCompanions(snapshotId)} />
  );
}
