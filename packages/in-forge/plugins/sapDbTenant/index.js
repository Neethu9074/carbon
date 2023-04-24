/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import metricDefinitions from 'in-forge/plugins/sapDbTenant/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/sapDbTenant//kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';
registerSnapshotDefinition({
  plugin: plugins.sapDbTenant,
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: t('in-forge:plugins.sapDbTenant.label')
  }
});
