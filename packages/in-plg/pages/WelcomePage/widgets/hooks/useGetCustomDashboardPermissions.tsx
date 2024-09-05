/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useObservable } from '@instana/hooks';

import { getCustomDashboard } from 'in-custom-dashboards/api';

export default function useGetCustomDashboardPermissions(id: string, annotations: Array<string>) {
  const result = useObservable(getCustomDashboard(id), [id]);

  if (result && !result?.progress?.loading && result?.data?.accessRules) {
    if (result.data.accessRules.length === 0) {
      if (annotations?.includes('SHARED')) {
        return 'Shared';
      } else {
        return 'Private';
      }
    }
    const hasGlobalRelation = result.data.accessRules.some(item => item.relationType === 'GLOBAL');
    if (hasGlobalRelation) {
      return 'Shared';
    } else {
      return 'Private';
    }
  }
  return null;
}
