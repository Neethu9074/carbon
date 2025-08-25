/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { supportsOpenFiles as hostSupportsOpenFiles } from 'in-forge/plugins/host/hostUtils';

function isAwsEcs(snapshotData) {
  return /^arn:.+:ecs:.+:.+:task\//.test(snapshotData.get('com.instana.plugin.host.name'));
}

export function supportsOpenFiles(hostSnapshot, snapshotData) {
  return (hostSnapshot && hostSupportsOpenFiles(hostSnapshot)) || isAwsEcs(snapshotData);
}
