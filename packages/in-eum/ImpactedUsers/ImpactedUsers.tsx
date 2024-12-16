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
  timeConfig: TimeConfig;
  joinFilterForImpactedUsers: TagFilterExpressionElementUnion;
  joinFilterForTotalUsers?: TagFilterExpressionElementUnion | null;
}

export default function ImpactedUsers({
  timeConfig,
  joinFilterForImpactedUsers,
  joinFilterForTotalUsers
}: ImpactedUsersProps) {
  const metricConfig = useMemo(
    () => ({
      impacted: { timeConfig: timeConfig, joinFilterExpression: joinFilterForImpactedUsers },
      total: { timeConfig: timeConfig, joinFilterExpression: joinFilterForTotalUsers }
    }),
    [joinFilterForImpactedUsers, joinFilterForTotalUsers, timeConfig]
  );
  const metricImpacts = useImpactedUsersMetrics(metricConfig);

  return (
    <ImpactedUsersPresenter
      timeConfig={timeConfig}
      metricImpacts={metricImpacts}
      downloadProp={{ joinFilterForImpactedUsers }}
    />
  );
}
