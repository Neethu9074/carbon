/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TimeConfig, KubernetesPod } from '@instana/types';

import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
// @ts-expect-error
import EntityHealthIndicator from 'in-components/EntityHealthIndicator';
import ArgoCDCluster from 'in-kubernetes/Dashboards/ArgoCD/ArgoCDCluster';
import { ApplicationTagFilter } from 'in-analyze/applicationFilter';
import ContextGuide from 'in-components/ContextGuide/ContextGuide';

interface DashboardButtonLineProps {
  snapshotId: string;
  plugin: string;
  timeConfig: TimeConfig;
  tagFilters: ApplicationTagFilter[];
  pod?: KubernetesPod;
}

export default function DashboardButtonLine({ snapshotId, timeConfig, tagFilters, plugin }: DashboardButtonLineProps) {
  return (
    <>
      <EntityHealthIndicator
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        snapshotId={snapshotId}
        timeConfig={timeConfig}
      />
      <ArgoCDCluster buttonSize="normal" snapshotId={snapshotId} timeConfig={timeConfig} />

      <ContextGuide id={snapshotId} plugin={plugin} timeConfig={timeConfig} tagFilters={tagFilters} />
    </>
  );
}
