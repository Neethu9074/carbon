/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import metricDefinitions from 'in-forge/plugins/ibmVsi/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmVsi/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.ibmVsi,

  technologyDescriptor: {
    label: t('in-forge:plugins.ibmVsi.ibmVsi')
  },
  kpiDefinitions,
  metricDefinitions
});
