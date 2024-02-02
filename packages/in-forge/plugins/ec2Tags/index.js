/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

/**
 * Please note that this is an internal entity for tags on EC2 entities, which should not be exposed to users.
 */
registerSnapshotDefinition({
  plugin: plugins.ec2Tags,
  getIconType: () => 'ec2'
});
