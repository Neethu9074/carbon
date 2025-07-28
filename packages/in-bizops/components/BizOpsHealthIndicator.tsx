/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter/HealthIndicatorPresenter';
import GenericIndicatorPresenter from 'in-components/GenericIndicatorPresenter/GenericIndicatorPresenter';
import BizOpsOpenIssuesList from 'in-bizops/components/BizOpsOpenIssuesList';

interface BizOpsHealthIndicatorProps {
  openIssues: number;
  maxSeverity: number;
  serviceIds: string[];
  timeConfig: TimeConfig;
  inContentArea: boolean;
}

// Displays health status for a resource with multiple serviceIDs
export default function BizOpsHealthIndicator(props: BizOpsHealthIndicatorProps) {
  const { openIssues, maxSeverity, inContentArea } = props;

  if (openIssues == null || openIssues < 0) {
    return null;
  }

  if (openIssues === 0) {
    return <HealthIndicatorPresenter active={false} maxSeverity={maxSeverity} openIssues={openIssues} />;
  }

  return (
    <GenericIndicatorPresenter
      contentProps={{ ...props, close: () => {} }}
      Content={Content}
      inContentArea={inContentArea}
      IndicatorPresenter={HealthIndicatorPresenter}
      indicatorProps={{
        openIssues: openIssues ?? 0,
        maxSeverity: maxSeverity ?? 0,
        active: false
      }}
    />
  );
}

interface BizOpsHealthContentProps {
  serviceIds: string[];
  timeConfig: TimeConfig;
  inContentArea: boolean;
  close: any;
}

function Content(props: BizOpsHealthContentProps) {
  return <BizOpsOpenIssuesList {...props} />;
}
