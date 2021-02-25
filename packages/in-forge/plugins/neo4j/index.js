/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import kpiDefinitions from 'in-forge/plugins/neo4j/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.neo4j,

  kpiDefinitions,
  technologyDescriptor: {
    label: 'neo4j'
  }
});
