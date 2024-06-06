/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useMemo } from 'react';

import { useObservable } from '@instana/hooks';

import getEumBeaconByTrace, { makeEumBeaconByTraceQuery } from 'in-eum/subscriptions/getEumBeaconByTrace';
import ImpactedUsersPresenter, { AdjustedTimeConfig } from 'in-eum/ImpactedUsers/ImpactedUsersPresenter';
import { useImpactedUsersMetrics } from 'in-eum/hooks/useImpactedUsers';
import { TagFilterExpressionElementUnion, TimeConfig } from 'in-types';
import { hours } from 'in-services/time';

// currently we'll only show impacted users in last 24 hours (alert.end or now - 24h) to avoid big queries.
// in future, we'll force granularity in the data and split big query into smaller ones.
const maxImpactedUserWindowSize = hours.toMillis(24);

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
  const adjustedTimeConfig = useMemo(() => adjustTimeConfigToRecent(timeConfig), [timeConfig]);
  const metricConfig = useMemo(
    () => ({
      impacted: { timeConfig: adjustedTimeConfig, joinFilterExpression: joinFilterForImpactedUsers },
      total: { timeConfig: adjustedTimeConfig, joinFilterExpression: joinFilterForTotalUsers }
    }),
    [joinFilterForImpactedUsers, joinFilterForTotalUsers, adjustedTimeConfig]
  );
  const metricImpacts = useImpactedUsersMetrics(metricConfig);

  const impactedWebsitesOrMobiles = useObservable(
    () =>
      getEumBeaconByTrace(
        makeEumBeaconByTraceQuery({
          metrics: ['beaconByTrace.configId', 'beaconByTrace.source'],
          timeConfig: adjustedTimeConfig,
          joinFilterExpression: joinFilterForImpactedUsers,
          distinctBy: 'beaconByTrace.configId'
        })
      ),
    [adjustedTimeConfig, joinFilterForImpactedUsers]
  );

  return (
    <ImpactedUsersPresenter
      adjustedTimeConfig={adjustedTimeConfig}
      metricImpacts={metricImpacts}
      impactedWebsitesOrMobiles={impactedWebsitesOrMobiles}
      downloadProp={{ joinFilterForImpactedUsers }}
    />
  );
}

function adjustTimeConfigToRecent(timeConfig: TimeConfig): AdjustedTimeConfig {
  if (timeConfig.windowSize > maxImpactedUserWindowSize) {
    return { ...timeConfig, windowSize: maxImpactedUserWindowSize, reduced: true };
  }
  return { ...timeConfig, reduced: false };
}
