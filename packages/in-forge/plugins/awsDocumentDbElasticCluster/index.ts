/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// @ts-expect-error Module needs to be translated to TS
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import kpiDefinitions from './kpiDefinitions';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.awsDocumentDbElasticCluster,

  technologyDescriptor: {
    label: t('in-forge:plugins.awsDocumentDbElasticCluster.awsDocumentDbElasticCluster')
  },
  kpiDefinitions,
  metricDefinitions
});
