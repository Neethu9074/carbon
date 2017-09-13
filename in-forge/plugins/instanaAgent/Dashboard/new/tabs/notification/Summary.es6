import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import SnapshotLabel from 'in-sdk/components/dashboard/summary/SnapshotLabel';
import { getLabel } from 'in-sdk/snapshot';

export default function Summary({ snapshot, notificationId }) {
  return (
    <MaxWidthFullscreenContainer>
      <SnapshotLabel>
        {`${getLabel(snapshot)}: ${notificationId}`}
      </SnapshotLabel>

    </MaxWidthFullscreenContainer>
  );
}
