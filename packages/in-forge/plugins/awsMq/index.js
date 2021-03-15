/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/awsMq/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/awsMq/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.awsMq,

  kpiDefinitions,
  metricDefinitions,
  getLabel(snapshot) {
    return snapshot.getIn(['data', 'broker_name'], '');
  },
  technologyDescriptor: {
    label: t('in-forge:plugins.awsMq.awsMq')
  }
});
