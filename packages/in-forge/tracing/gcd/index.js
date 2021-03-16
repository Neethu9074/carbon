/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'gcd',
  category: 'database',

  typeName: {
    singular: t('in-forge:tracing.gcd.indexName'),
    plural: t('in-forge:tracing.gcd.indexName_plural')
  },

  detailView: 'GCDSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'gcd', 'op']) + ' ' + span.getIn(['data', 'gcd', 'mode']);
  }
});
