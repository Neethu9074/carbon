/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import kpiDefinitions from 'in-forge/plugins/nats/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.nats,

  kpiDefinitions,
  technologyDescriptor: {
    label: t('in-forge:plugins.nats.nats')
  }
});
