/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'boto3',
  category: 'http',

  typeName: {
    singular: t('in-forge:tracing.boto3.indexName'),
    plural: t('in-forge:tracing.boto3.indexName_plural')
  },

  detailView: 'Boto3SpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'boto3', 'op']);
  }
});
