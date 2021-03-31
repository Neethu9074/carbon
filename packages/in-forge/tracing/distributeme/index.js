/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'distributeme',
  category: t('in-forge:tracingCategory.remote'),

  detailView: 'DistributeMeSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'distributeme', 'service'], 'Unkown');
  }
});
