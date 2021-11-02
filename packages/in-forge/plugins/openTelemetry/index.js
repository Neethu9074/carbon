/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/openTelemetry/metricDefinitions';
import { AVAILABLE_SPECS } from 'in-sdk/components/dashboard/CustomMetricsV2';
import kpiDefinitions from 'in-forge/plugins/openTelemetry/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

const SPECS = [AVAILABLE_SPECS.GAUGE, AVAILABLE_SPECS.HISTOGRAM, AVAILABLE_SPECS.SUMMARY];

registerSnapshotDefinition({
  plugin: plugins.openTelemetry,
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: t('in-forge:plugins.openTelemetry.openTelemetry')
  },
  customMetricsSpecs: SPECS
});
