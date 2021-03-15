/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'otel',
  category: 'generic',

  typeName: {
    singular: t('in-forge:tracing.otel.indexName', { count: 1 }),
    plural: t('in-forge:tracing.otel.indexName', { count: 2 })
  },

  detailView: 'OTelSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'service']) + ' ' + span.getIn(['data', 'operation']);
  }
});
