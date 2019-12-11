import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/awsEs/kpiDefinitions';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.awsEs,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,

  pluginName: {
    singular: 'AWS Elasticsearch',
    plural: 'AWS Elasticsearch'
  },
  getLabel(snapshot) {
    return snapshot.getIn(['data', 'es_domain_name'], '');
  }
});
