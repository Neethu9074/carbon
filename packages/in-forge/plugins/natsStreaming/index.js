/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import kpiDefinitions from 'in-forge/plugins/natsStreaming/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.natsStreaming,

  kpiDefinitions,
  technologyDescriptor: {
    label: t('in-forge:plugins.natsStreaming.natsStreaming')
  }
});
