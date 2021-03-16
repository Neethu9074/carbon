/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getLabel } from 'in-forge/tracing/http/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'jersey.client',
  category: 'http',

  typeName: {
    singular: t('in-forge:tracing.jerseyClient.indexName'),
    plural: t('in-forge:tracing.jerseyClient.indexName_plural')
  },

  detailView: 'JerseyClientSpanDetailView',

  getLabel
});
