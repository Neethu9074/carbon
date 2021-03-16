/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'jaeger',
  category: 'generic',

  typeName: {
    singular: t('in-forge:tracing.jaeger.indexName'),
    plural: t('in-forge:tracing.jaeger.indexName_plural')
  },

  detailView: 'JaegerSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'service']) + ' ' + span.getIn(['data', 'operation']);
  }
});
