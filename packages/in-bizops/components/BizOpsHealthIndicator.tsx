/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { LegacyRef } from 'react';

import { TimeConfig } from '@instana/types';

import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter/HealthIndicatorPresenter';
import BizOpsOpenIssuesList from 'in-bizops/components/BizOpsOpenIssuesList';
import Overlay from 'in-components/overlays/Overlay';

interface BizOpsHealthIndicatorProps {
  openIssues: number;
  maxSeverity: number;
  serviceIds: string[];
  timeConfig: TimeConfig;
  inContentArea: boolean;
}

// Displays health status for a resource with multiple serviceIDs
export default function BizOpsHealthIndicator({
  openIssues,
  maxSeverity,
  serviceIds,
  timeConfig,
  inContentArea
}: BizOpsHealthIndicatorProps) {
  if (openIssues == null || openIssues < 0) {
    return null;
  }

  if (openIssues === 0) {
    return <HealthIndicatorPresenter active={false} maxSeverity={maxSeverity} openIssues={openIssues} />;
  }

  return (
    <Overlay
      props={{ openIssues, maxSeverity, serviceIds, timeConfig, inContentArea }}
      content={Content}
      inContentArea={inContentArea}
      align="leftTop"
      withoutWrapper
    >
      {({ toggle, refSetter }) => (
        <HealthIndicatorPresenter
          openIssues={openIssues ?? 0}
          maxSeverity={maxSeverity ?? 0}
          onClick={toggle}
          refSetter={refSetter as LegacyRef<HTMLAnchorElement>}
          active={false}
        />
      )}
    </Overlay>
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
