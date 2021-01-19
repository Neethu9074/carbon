/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getLabel } from 'in-forge/tracing/graphql/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'graphql',
  category: 'graphql',

  typeName: {
    singular: 'GraphQL Call',
    plural: 'GraphQL Calls'
  },

  detailView: 'GraphQLSpanDetailView',

  getLabel
});
