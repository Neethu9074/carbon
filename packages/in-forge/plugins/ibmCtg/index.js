/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

/*
 * Currently this only exists to register the technology tag CTG. There is no infra back end plug-in for CTG (yet) nor
 * is there a dashboard or metrics for it.
 */
registerSnapshotDefinition({
  plugin: plugins.ibmCtg,
  technologyDescriptor: {
    label: t('in-forge:pluginName_ibmCtg')
  }
});
