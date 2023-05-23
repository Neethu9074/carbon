/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/processingStatistics/metricDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

/**
 * Please note that this is an internal entity for internal processing statistics, which should not be exposed to users.
 */
registerSnapshotDefinition({
  plugin: plugins.processingStatistics,
  metricDefinitions
});
