/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-expect-error needs TS migration
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from 'in-forge/plugins/sapJavaNetWeaverInstanceSensor/metricDefinitions';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.sapJavaNetWeaverInstanceSensor,
  metricDefinitions,
  technologyDescriptor: {
    label: t('in-forge:plugins.sapJavaNetWeaverInstanceSensor.label')
  }
});
