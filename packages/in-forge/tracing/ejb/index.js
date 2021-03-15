/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'ejb',
  category: 'remote',

  typeName: {
    singular: t('in-forge:tracing.ejb.indexName'),
    plural: t('in-forge:tracing.ejb.indexName_plural')
  },

  detailView: 'EJBSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'ejb', 'method']);
  }
});
