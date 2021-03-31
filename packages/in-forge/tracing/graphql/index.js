/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getLabel } from 'in-forge/tracing/graphql/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'graphql',
  category: t('in-forge:tracingCategory.graphql'),

  detailView: 'GraphQLSpanDetailView',

  getLabel
});
