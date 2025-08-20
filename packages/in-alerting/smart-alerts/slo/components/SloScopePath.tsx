/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TimeConfig, BoundaryScope, ServiceLevelObjectiveConfiguration } from '@instana/types';
import { LoadingSkeleton, SvgIconSizes } from '@instana/components';
import { Stack } from '@instana/carbon';

import useGetHrefToSloDashboard from 'in-service-levels/navigation/hooks/useGetHrefToSloDashboard';
import SyntheticScopeTable from 'in-alerting/smart-alerts/slo/components/SyntheticScopeTable';
import useSyntheticTests from 'in-alerting/smart-alerts/slo/hooks/useSyntheticTests';
import { useLinkToApplicationDashboard } from 'in-applications/navigation/paths';
import ScopePath, { ScopeEntryType } from 'in-alerting/components/ScopePath';
import { useSyntheticTestDashboard } from 'in-synthetics/navigation/paths';
import { useLinkToWebsite } from 'in-websites/navigation/paths';

interface SloScopePathProps {
  sloId: string;
  sloLabel: string;
  entityType: string;
  entityId: string;
  entityLabel: string;
  boundaryScope?: BoundaryScope;
  timeConfig?: TimeConfig;
  iconSize?: keyof typeof SvgIconSizes;
  noBottomMargin?: boolean;
  sloConfig?: ServiceLevelObjectiveConfiguration;
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
  noBottomMargin,
  sloConfig
}: SloScopePathProps) {
  const getObjectiveDashboard = useGetHrefToSloDashboard();
  const getApplicationDashboard = useLinkToApplicationDashboard();
  const websiteDashboardHref = useLinkToWebsite(entityId ?? undefined, {
    timeConfig
  });
  const getSyntheticDashboard = useSyntheticTestDashboard();
  const entries: ScopeEntryType[] = [];

  const [syntheticTests, status, errors] = useSyntheticTests({ sloConfig }) ?? [];
  const showSyntheticTestTable = syntheticTests ? syntheticTests.length > 1 : false;
  const [syntheticTest] = syntheticTests ?? [undefined];

  if (status === 'pending') {
    return <LoadingSkeleton />;
  }

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

  if (entityType === 'syntheticTest' && !showSyntheticTestTable && syntheticTest) {
    const { id, label } = syntheticTest;
    const syntheticDashboardHref = getSyntheticDashboard({ testId: id!, testLabel: label });
    entries.push({
      iconType: 'lib_synthetic',
      label,
      href: syntheticDashboardHref != null ? syntheticDashboardHref : undefined
    });
  }

  return (
    <Stack orientation="vertical">
      <ScopePath entries={entries} iconSize={iconSize} noBottomMargin={noBottomMargin} />
      {/* We can safely assert these are non-null due to showSyntheticTestTable checking for the contents of syntheticTests */}
      {showSyntheticTestTable && (
        <SyntheticScopeTable errors={errors!} status={status!} syntheticTests={syntheticTests!} />
      )}
    </Stack>
  );
}
