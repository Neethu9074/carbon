/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import metricDefinitions from 'in-forge/plugins/ibmiLicensedProgramInfo/metricDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.ibmiLicensedProgramInfo,
  metricDefinitions,
  technologyDescriptor: {
    label: t('in-forge:plugins.ibmiLicensedProgramInfo.name')
  },
  getIconType: () => 'ibmIOs'
});
