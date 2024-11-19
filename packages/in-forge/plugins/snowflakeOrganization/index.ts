/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import kpiDefinitions from 'in-forge/plugins/snowflakeOrganization/kpiDefinitions';
//@ts-expect-error
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.snowflakeOrganization,
  kpiDefinitions,
  getIconType: () => 'snowflake'
});
