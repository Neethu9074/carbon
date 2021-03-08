/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { getLabel } from 'in-forge/tracing/graphql/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'graphql.server',
  category: 'graphql',

  typeName: {
    singular: t('in-forge:tracing.graphqlServer.indexName'),
    plural: t('in-forge:tracing.graphqlServer.indexName_plural')
  },

  detailView: 'GraphQLServerDetailView',

  getLabel
});
