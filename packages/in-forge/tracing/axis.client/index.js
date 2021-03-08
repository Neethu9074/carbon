/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { getLabel } from 'in-forge/tracing/http/spanDefinition';

registerSpanDefinition({
  type: 'axis.client',
  category: 'http',

  typeName: {
    singular: t('in-forge:tracing.axisClient.indexName'),
    plural: t('in-forge:tracing.axisClient.indexName_plural')
  },

  detailView: 'AxisHttpClientSpanDetailView',

  getLabel
});
