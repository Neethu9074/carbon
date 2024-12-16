/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import CustomMetricsV2, { AVAILABLE_SPECS } from 'in-sdk/components/dashboard/CustomMetricsV2';
import { DEFAULT_DISTANCE_BETWEEN_DATA_POINTS_OTEL } from 'in-forge/constants';
import { t } from 'in-i18n';

export default function OpenTelemetryDashboard({ snapshot, timeConfig }) {
  return (
    <CustomMetricsV2
      snapshot={snapshot}
      timeConfig={timeConfig}
      titlePrefix={t('in-forge:plugins.openTelemetry.openTelemetry')}
      distanceBetweenDatapointsInMillis={DEFAULT_DISTANCE_BETWEEN_DATA_POINTS_OTEL}
      specs={SPECS}
    />
  );
}

export const SPECS = [AVAILABLE_SPECS.GAUGE, AVAILABLE_SPECS.HISTOGRAM, AVAILABLE_SPECS.SUM, AVAILABLE_SPECS.SUMMARY];
