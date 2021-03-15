/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
import { t } from 'in-i18n';

import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.apmProxy,

  technologyDescriptor: {
    label: t('in-forge:plugins.apmProxy.apmProxy')
  }
});
