/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SvgIconSizes } from '@instana/components';

import useHrefToSloDashboard from 'in-service-levels/navigation/hooks/useHrefToSloDashboard';
import ScopePath, { ScopeEntryType } from 'in-alerting/components/ScopePath';
import { TimeConfig } from 'in-types';

interface Props {
  sloId?: string;
  sloLabel: string;
  timeConfig?: TimeConfig;
  iconSize?: keyof typeof SvgIconSizes;
  noBottomMargin?: boolean;
}

export default function SloScopePath({ sloId, sloLabel, timeConfig, iconSize, noBottomMargin }: Props) {
  const getObjectiveDashboard = useHrefToSloDashboard();
  const entries: ScopeEntryType[] = [];

  if (sloLabel) {
    entries.push({
      iconType: 'lib_service_level',
      label: sloLabel,
      href: sloId != null ? getObjectiveDashboard(sloId, timeConfig) : undefined
    });
  }

  return <ScopePath entries={entries} iconSize={iconSize} noBottomMargin={noBottomMargin} />;
}
