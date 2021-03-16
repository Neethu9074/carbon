/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/awsSqs/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/awsSqs/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.awsSqs,

  technologyDescriptor: {
    label: t('in-forge:plugins.awsSqs.awsSqs')
  },
  kpiDefinitions,
  metricDefinitions
});
