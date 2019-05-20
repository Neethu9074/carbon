import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.neo4j,
  iconSvgPath,
  pluginName: {
    singular: 'Neo4j Node',
    plural: 'Neo4j Nodes'
  },
  technologyDescriptor: {
    label: 'neo4j'
  }
});
