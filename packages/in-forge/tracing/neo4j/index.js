/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'neo4j',
  category: 'database',
  typeName: {
    singular: 'Neo4j statement',
    plural: 'Neo4j statements'
  },
  detailView: 'Neo4jSpanDetailView'
});
