/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TimeConfig, BoundaryScope } from '@instana/types';
import { SvgIconSizes } from '@instana/components';

import useHrefToSloDashboard from 'in-service-levels/navigation/hooks/useHrefToSloDashboard';
import { useLinkToApplicationDashboard } from 'in-applications/navigation/paths';
import ScopePath, { ScopeEntryType } from 'in-alerting/components/ScopePath';
import { useLinkToWebsite } from 'in-websites/navigation/paths';

interface Props {
  sloId: string;
  sloLabel: string;
  entityType: string;
  entityId: string;
  entityLabel: string;
  boundaryScope?: BoundaryScope;
  timeConfig?: TimeConfig;
  iconSize?: keyof typeof SvgIconSizes;
  noBottomMargin?: boolean;
}

export default function SloScopePath({
  sloId,
  sloLabel,
  entityType,
  entityId,
  entityLabel,
  boundaryScope,
  timeConfig,
  iconSize,
  noBottomMargin
}: Props) {
  const getObjectiveDashboard = useHrefToSloDashboard();
  const getApplicationDashboard = useLinkToApplicationDashboard();
  const websiteDashboardHref = useLinkToWebsite(entityId, {
    timeConfig
  });

  const entries: ScopeEntryType[] = [];

  if (sloLabel) {
    entries.push({
      iconType: 'lib_service_level',
      label: sloLabel,
      href: sloId != null ? getObjectiveDashboard(sloId, timeConfig) : undefined
    });
  }

  if (entityLabel) {
    if (entityType === 'application') {
      entries.push({
        iconType: 'lib_application',
        label: entityLabel,
        href:
          entityId != null
            ? getApplicationDashboard({
                applicationId: entityId,
                timeConfig,
                boundaryScope
              })
            : undefined
      });
    }
    if (entityType === 'website') {
      entries.push({
        iconType: 'lib_website',
        label: entityLabel,
        href: entityId != null ? websiteDashboardHref : undefined
      });
    }
  }

  return <ScopePath entries={entries} iconSize={iconSize} noBottomMargin={noBottomMargin} />;
}
