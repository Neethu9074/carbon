/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import kpiDefinitions from './kpiDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.tibcoEMS,
  metricDefinitions,
  kpiDefinitions,

  technologyDescriptor: {
    label: t('in-forge:plugins.tibcoEMS.headerTibcoEMS')
  }
});
