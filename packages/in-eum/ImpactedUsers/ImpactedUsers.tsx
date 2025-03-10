/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useMemo } from 'react';

import ImpactedUsersPresenter from 'in-eum/ImpactedUsers/ImpactedUsersPresenter';
import { useImpactedUsersMetrics } from 'in-eum/hooks/useImpactedUsers';
import { TagFilterExpressionElementUnion, TimeConfig } from 'in-types';

interface ImpactedUsersProps {
  alertType?: string ;
  timeConfig: TimeConfig;
  joinFilterForImpactedUsers: TagFilterExpressionElementUnion;
  joinFilterForTotalUsers?: TagFilterExpressionElementUnion | null;
  isKPI: boolean;
}

export default function ImpactedUsers({
  alertType,
  timeConfig,
  joinFilterForImpactedUsers,
  joinFilterForTotalUsers,
  isKPI
}: ImpactedUsersProps) {
  const metricConfig = useMemo(
    () => ({
      impacted: { timeConfig: timeConfig, joinFilterExpression: joinFilterForImpactedUsers },
      total: { timeConfig: timeConfig, joinFilterExpression: joinFilterForTotalUsers }
    }),
    [joinFilterForImpactedUsers, joinFilterForTotalUsers, timeConfig]
  );

  const metricImpacts = useImpactedUsersMetrics(metricConfig, alertType);

  return (
    <ImpactedUsersPresenter
      alertType={alertType}
      timeConfig={timeConfig}
      metricImpacts={metricImpacts}
      downloadProp={{ joinFilterForImpactedUsers }}
      isKPI={isKPI}
    />
  );
}
