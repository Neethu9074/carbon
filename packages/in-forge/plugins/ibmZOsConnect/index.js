/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

/*
 * Currently this only exists to register the technology tag z/OS Connect. There is no infra back end plug-in for it
 * (yet) nor is there a dashboard or metrics for it.
 */
registerSnapshotDefinition({
  plugin: plugins.ibmZOsConnect,
  technologyDescriptor: {
    label: t('in-forge:pluginName_ibmZOsConnect')
  }
});
