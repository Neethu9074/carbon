/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import metricDefinitions from 'in-forge/plugins/kafkaCluster/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/kafkaCluster/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.kafkaCluster,

  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: t('in-forge:plugins.kafkaCluster.kafka')
  }
});
