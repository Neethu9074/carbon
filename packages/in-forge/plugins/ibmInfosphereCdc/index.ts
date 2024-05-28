/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import metricDefinitions from 'in-forge/plugins/ibmInfosphereCdc/metricDefinitions';
//@ts-expect-error
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.ibmInfosphereCdc,

  metricDefinitions,
  technologyDescriptor: {
    label: t('in-forge:plugins.ibmInfosphereCdc.ibmInfosphereCdc')
  },
  getIconType: () => 'ibmInfosphereCdc'
});
