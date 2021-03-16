/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/service/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/service/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.service,

  kpiDefinitions,
  metricDefinitions,
  chartWiggleRoom: 20000,
  getLabel(entity) {
    return entity.get('label', t('in-forge:plugins.service.service'));
  }
});
