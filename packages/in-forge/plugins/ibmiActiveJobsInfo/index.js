/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import metricDefinitions from 'in-forge/plugins/ibmiActiveJobsInfo/metricDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from '../../../in-i18n';

registerSnapshotDefinition({
  plugin: plugins.ibmiActiveJobsInfo,
  metricDefinitions,
  technologyDescriptor: {
    label: t('in-forge:plugins.ibmiActiveJobsInfo.name')
  },
  getIconType: () => 'ibmIOs'
});
