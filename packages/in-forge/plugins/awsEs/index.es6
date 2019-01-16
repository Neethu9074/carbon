import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.awsEs,
  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'AWS Elastic search',
    plural: 'AWS Elastic search'
  },
  getLabel(snapshot) {
    return snapshot.getIn(['data', 'es_domain_name'], '');
  }
});
