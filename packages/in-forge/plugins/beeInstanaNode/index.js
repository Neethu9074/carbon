/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/beeInstanaNode/metricDefinitions';
import tableDefinition from 'in-forge/plugins/beeInstanaNode/tableDefinition';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.beeInstanaNode,

  metricDefinitions,
  tableDefinition,
  technologyDescriptor: {
    label: t('in-forge:plugins.beeInstana.labelBeeInstana')
  }
});
