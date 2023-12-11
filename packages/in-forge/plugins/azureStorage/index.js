/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/azureStorage/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/azureStorage/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.azureStorage,

  technologyDescriptor: {
    label: t('in-forge:pluginName_azureStorage')
  },

  kpiDefinitions,
  metricDefinitions
});
