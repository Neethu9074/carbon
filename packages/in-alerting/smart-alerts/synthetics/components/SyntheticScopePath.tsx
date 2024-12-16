/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SvgIconSizes } from '@instana/components';

import { useSyntheticTestDashboard } from 'in-synthetics/navigation/paths';
import ScopePath from 'in-alerting/components/ScopePath';
import { TimeConfig } from 'in-types';

interface Props {
  syntheticTestId?: string;
  syntheticTestLabel: string;
  locationLabel: string;
  timeConfig?: TimeConfig;
  iconSize?: keyof typeof SvgIconSizes;
  noBottomMargin?: boolean;
}

export default function SyntheticScopePath({
  syntheticTestId,
  syntheticTestLabel,
  locationLabel,
  timeConfig,
  iconSize,
  noBottomMargin
}: Props) {
  const getSyntheticTestDashboard = useSyntheticTestDashboard();
  const entries = [];

  if (syntheticTestLabel) {
    entries.push({
      iconType: 'lib_synthetic',
      label: syntheticTestLabel,
      href:
        syntheticTestId != null ? getSyntheticTestDashboard(syntheticTestId, syntheticTestLabel, timeConfig) : undefined
    });
  }

  if (locationLabel) {
    entries.push({
      iconType: 'lib_synthetic_location',
      label: locationLabel
    });
  }

  return <ScopePath entries={entries} iconSize={iconSize} noBottomMargin={noBottomMargin} />;
}
