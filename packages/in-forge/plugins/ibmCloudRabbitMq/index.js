/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import metricDefinitions from 'in-forge/plugins/ibmCloudRabbitMq/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmCloudRabbitMq/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.ibmCloudRabbitMq,

  technologyDescriptor: {
    label: 'IBM Cloud Messages for RabbitMQ'
  },
  kpiDefinitions,
  metricDefinitions
});
