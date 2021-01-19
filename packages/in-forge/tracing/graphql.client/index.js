/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getLabel } from 'in-forge/tracing/graphql/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'graphql.client',
  category: 'graphql',

  typeName: {
    singular: 'GraphQL Subscription Update',
    plural: 'GraphQL Subscription Updates'
  },

  detailView: 'GraphQLClientDetailView',

  getLabel
});
