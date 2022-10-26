/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from '../rocketMqBroker/metricDefinitions';
import kpiDefinitions from '../rocketMqBroker/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.rocketMqBroker,
  kpiDefinitions,
  metricDefinitions
});
