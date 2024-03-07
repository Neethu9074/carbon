/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useState, useEffect } from 'react';

import { useObservable } from '@instana/hooks';

import { getCustomDashboard } from 'in-custom-dashboards/api';
import { CustomDashboard } from 'in-types';

export default function useGetCustomDashboard(dashboardId: string) {
  const [dashboard, setDashboard] = useState<CustomDashboard | null>(null);

  const dashboardResult = useObservable(getCustomDashboard(dashboardId), [dashboardId]);
  useEffect(() => {
    if (dashboardResult?.data) {
      setDashboard(dashboardResult.data);
    }
  }, [dashboardResult]);

  return dashboard;
}
