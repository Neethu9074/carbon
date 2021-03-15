/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/vault/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/vault/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.vault,
  metricDefinitions,
  kpiDefinitions,

  technologyDescriptor: {
    label: t('in-forge:plugins.vault.labelVault')
  }
});
