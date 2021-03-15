/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'gcb',
  category: 'database',

  typeName: {
    singular: t('in-forge:tracing.gcb.indexName'),
    plural: t('in-forge:tracing.gcb.indexName_plural')
  },

  detailView: 'GCBSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'gcb', 'op']);
  }
});
