/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import HealthIndicatorButtonPresenter, {
  HealthIndicatorButtonPresenterProps
} from 'in-components/health/HealthIndicatorButtonPresenter';
import { getHealthyStatus } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/utils';
// @ts-expect-error
import EntityHealthIndicator from 'in-components/EntityHealthIndicator';
import { ApplicationTagFilter } from 'in-analyze/applicationFilter';
import ContextGuide from 'in-components/ContextGuide/ContextGuide';
import { TimeConfig, KubernetesPod } from 'in-types';

interface DashboardButtonLineProps {
  snapshotId: string;
  plugin: string;
  timeConfig: TimeConfig;
  tagFilters: ApplicationTagFilter[];
  pod: KubernetesPod;
}

export default function DashboardButtonLine({
  snapshotId,
  timeConfig,
  tagFilters,
  plugin,
  pod
}: DashboardButtonLineProps) {
  return (
    <>
      <EntityHealthIndicator
        IndicatorPresenter={(props: HealthIndicatorButtonPresenterProps) => (
          <HealthIndicatorButtonPresenter {...getIndicatorPresenter({ plugin, pod, ...props })} />
        )}
        snapshotId={snapshotId}
        timeConfig={timeConfig}
      />
      <ContextGuide id={snapshotId} plugin={plugin} timeConfig={timeConfig} tagFilters={tagFilters} />
    </>
  );
}

export function getIndicatorPresenter({ plugin, pod, ...props }: any) {
  if (plugin !== 'kubernetesPod') {
    return props;
  }

  const { conditions, status } = pod;
  const { maxSeverity: baseMaxSeverity, openIssues } = props;

  const { maxSeverity, openIssuesCount } = getHealthyStatus({
    statusSummary: status?.statusSummary || '',
    podConditions: conditions,
    entityHealthInfo: {
      maxSeverity: baseMaxSeverity,
      openIssues
    }
  });

  return {
    ...props,
    maxSeverity,
    openIssues: openIssuesCount && null,
    openIncidents: null
  };
}
