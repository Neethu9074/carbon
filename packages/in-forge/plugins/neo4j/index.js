import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/neo4j/kpiDefinitions';

import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.neo4j,
  iconSvgPath,
  kpiDefinitions,
  pluginName: {
    singular: 'Neo4j Node',
    plural: 'Neo4j Nodes'
  },
  technologyDescriptor: {
    label: 'neo4j'
  }
});
