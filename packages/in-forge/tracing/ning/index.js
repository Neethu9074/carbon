/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { getLabel } from 'in-forge/tracing/http/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'ning',
  category: 'http',

  typeName: {
    singular: t('in-forge:tracing.ning.indexName', { count: 1 }),
    plural: t('in-forge:tracing.ning.indexName', { count: 2 })
  },

  detailView: 'NingSpanDetailView',

  getLabel
});
