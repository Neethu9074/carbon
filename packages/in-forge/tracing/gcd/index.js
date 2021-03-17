/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'gcd',
  category: t('in-forge:tracingCategory.database', 'database'),

  detailView: 'GCDSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'gcd', 'op']) + ' ' + span.getIn(['data', 'gcd', 'mode']);
  }
});
