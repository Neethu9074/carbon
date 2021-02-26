/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import metricDefinitions from 'in-forge/plugins/awsDynamoDb/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/awsDynamoDb/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.awsDynamoDb,
  kpiDefinitions,
  metricDefinitions,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'dyndb_table_name'], '');
  },
  technologyDescriptor: {
    label: t('in-forge:plugins.awsDynamoDb.labelAWSDynamoDB')
  }
});
