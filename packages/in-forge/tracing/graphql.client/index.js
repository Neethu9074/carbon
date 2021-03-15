/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getLabel } from 'in-forge/tracing/graphql/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'graphql.client',
  category: 'graphql',

  typeName: {
    singular: t('in-forge:tracing.graphqlClient.indexName'),
    plural: t('in-forge:tracing.graphqlClient.indexName_plural')
  },

  detailView: 'GraphQLClientDetailView',

  getLabel
});
