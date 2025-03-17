/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.tibcoEMSQueue,
  metricDefinitions,

  technologyDescriptor: {
    label: t('in-forge:plugins.tibcoEMSQueue.headerTibcoEMSQueue')
  }
});
