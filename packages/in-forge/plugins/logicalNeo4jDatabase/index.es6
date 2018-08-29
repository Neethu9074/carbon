import metricDefinitions from 'in-forge/plugins/defaultLogicalService/metricDefinitions';
import tableDefinition from 'in-forge/plugins/defaultLogicalService/tableDefinition';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-forge/plugins/neo4j/iconPath';

registerSnapshotDefinition({
  plugin: plugins.logicalNeo4jDatabase,

  iconSvgPath,
  tableDefinition,
  metricDefinitions,

  pluginName: {
    singular: 'Neo4j Database',
    plural: 'Neo4j Databases'
  },

  chartWiggleRoom: 20000
});
