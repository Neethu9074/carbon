/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import metricDefinitions from 'in-forge/plugins/sapHanaPlatform/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/sapHanaPlatform/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.sapHanaPlatform,
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: t('in-forge:plugins.sapHanaPlatform.label')
  }
});
