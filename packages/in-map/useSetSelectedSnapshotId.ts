/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useCallback, useEffect } from 'react';

//@ts-expect-error
import { setSelectedSnapshotId } from 'in-stores/snapshot';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';

export default function useSetSelectedSnapshotId() {
  const { location, navigate } = useNavigation();

  const handleSetSelectedSnapshotId = useCallback(
    e => {
      setSelectedSnapshotId(e.detail.dashboardId, location, navigate);
    },
    [location, navigate]
  );

  useEffect(() => {
    window.addEventListener('clickedOnEntityMap', handleSetSelectedSnapshotId);
    return () => window.removeEventListener('clickedOnEntityMap', handleSetSelectedSnapshotId);
  }, [handleSetSelectedSnapshotId]);
}
