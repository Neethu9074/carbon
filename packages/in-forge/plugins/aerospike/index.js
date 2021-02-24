/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import kpiDefinitions from 'in-forge/plugins/aerospike/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.aerospike,

  kpiDefinitions,
  technologyDescriptor: {
    label: t('in-forge:plugins.aerospike.aerospike')
  }
});
