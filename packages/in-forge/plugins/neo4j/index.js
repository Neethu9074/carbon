import kpiDefinitions from 'in-forge/plugins/neo4j/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/neo4j/iconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.neo4j,
  pluginName: {
    singular: 'Neo4j Node',
    plural: 'Neo4j Nodes'
  },
  iconSvgPath,
  kpiDefinitions,
  technologyDescriptor: {
    label: 'neo4j'
  }
});
