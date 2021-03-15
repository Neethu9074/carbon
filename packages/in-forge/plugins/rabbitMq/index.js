/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/rabbitMq/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/rabbitMq/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.rabbitMq,

  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'RabbitMQ'
  }
});
