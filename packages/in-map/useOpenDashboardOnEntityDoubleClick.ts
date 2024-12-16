/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useGoToDashboard } from 'in-stores/navigation/paths/dashboardPaths';
import { useCallback, useEffect } from 'react';

export default function useOpenDashboardOnEntityDoubleClick() {
  const goToDashboard = useGoToDashboard();

  const handleInfraMapItemClick = useCallback(
    e => {
      goToDashboard(e.detail.dashboardId);
    },
    [goToDashboard]
  );

  useEffect(() => {
    window.removeEventListener('clickedInfraMapItem', handleInfraMapItemClick);
    window.addEventListener('clickedInfraMapItem', handleInfraMapItemClick);
    return () => window.removeEventListener('clickedInfraMapItem', handleInfraMapItemClick);
  }, [handleInfraMapItemClick]);

}
