/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'cosmos',
  category: 'database',

  typeName: {
    singular: 'CosmosDB Call',
    plural: 'CosmosDB Calls'
  },

  detailView: 'CosmosSpanDetailView',

  getLabel(span) {
    return shortenSqlStatement(span.getIn(['data', 'cosmos', 'cmd'], ''));
  }
});
