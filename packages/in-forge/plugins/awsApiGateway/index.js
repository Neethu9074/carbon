/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import metricDefinitions from 'in-forge/plugins/awsApiGateway/metricDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.awsApiGateway,
  metricDefinitions,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'api_name'], '');
  },
  technologyDescriptor: {
    label: t('in-forge:pluginName_awsApiGateway')
  }
});
