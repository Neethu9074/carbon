/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import metricDefinitions from 'in-forge/plugins/nutanixDatacenter/metricDefinitions';
// @ts-expect-error needs TS migration
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import kpiDefinitions from 'in-forge/plugins/nutanixDatacenter/kpiDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.nutanixDatacenter,
  kpiDefinitions,
  metricDefinitions,
  getIconType: () => 'nutanix'
});
