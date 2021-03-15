/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import kpiDefinitions from './kpiDefinitions';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.tibcoEMS,
  metricDefinitions,
  kpiDefinitions,

  technologyDescriptor: {
    label: t('in-forge:plugins.tibcoEMS.headerTibcoEMS')
  }
});
