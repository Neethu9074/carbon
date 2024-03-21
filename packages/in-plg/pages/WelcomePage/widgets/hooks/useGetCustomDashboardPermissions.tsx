/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useState, useEffect } from 'react';

import { useObservable } from '@instana/hooks';

import { getCustomDashboard } from 'in-custom-dashboards/api';

export default function useGetCustomDashboardPermissions(id: string) {
  const [permission, setPermission] = useState<string>('Private');
  const result = useObservable(getCustomDashboard(id), [id]);

  useEffect(() => {
    if (result?.data) {
      result.data.accessRules?.forEach(item => {
        if (item.accessType === 'READ' && item.relationType === 'GLOBAL') {
          setPermission('Shared');
        }
      });
    }
  }, [result, id]);

  return permission;
}
