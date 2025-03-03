/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/googleCloudPubSub/metricDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.googleCloudPubSub,

  technologyDescriptor: {
    label: t('in-forge:plugins.googleCloudPubSub.googleCloudPubSub')
  },
  metricDefinitions
});
