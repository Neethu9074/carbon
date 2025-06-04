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
  entityType?: string | unknown;
  alertType?: string;
  timeConfig: TimeConfig;
  joinFilterForImpactedUsers: TagFilterExpressionElementUnion;
  joinFilterForTotalUsers: TagFilterExpressionElementUnion | null;
  isKPI: boolean;
}

export default function ImpactedUsers({
  entityType,
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
  const metricImpacts = useImpactedUsersMetrics(metricConfig, alertType, entityType);

  return (
    <ImpactedUsersPresenter
      entityType={entityType}
      alertType={alertType}
      timeConfig={timeConfig}
      metricImpacts={metricImpacts}
      downloadProp={{ tagFilterExpression: joinFilterForImpactedUsers }}
      isKPI={isKPI}
    />
  );
}
