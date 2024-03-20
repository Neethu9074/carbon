/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import metricDefinitions from 'in-forge/plugins/ibmiDiskInfo/metricDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from '../../../in-i18n';

registerSnapshotDefinition({
  plugin: plugins.ibmiDiskInfo,
  metricDefinitions,
  technologyDescriptor: {
    label: t('in-forge:plugins.ibmiDiskInfo.name')
  },
  getIconType: () => 'ibmIOs'
});
