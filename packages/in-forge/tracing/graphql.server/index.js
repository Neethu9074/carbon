/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getLabel } from 'in-forge/tracing/graphql/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'graphql.server',
  category: 'graphql',

  typeName: {
    singular: 'GraphQL Server Call',
    plural: 'GraphQL Server Calls'
  },

  detailView: 'GraphQLServerDetailView',

  getLabel
});
