/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getLabel } from 'in-forge/tracing/graphql/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'graphql',
  category: 'graphql',

  typeName: {
    singular: t('in-forge:tracing.graphql.indexName'),
    plural: t('in-forge:tracing.graphql.indexName_plural')
  },

  detailView: 'GraphQLSpanDetailView',

  getLabel
});
