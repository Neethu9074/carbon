/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'hornetq',
  category: t('in-forge:tracingCategory.messaging', 'messaging'),

  detailView: 'HornetQSpanDetailView',

  getLabel(span) {
    const label = span.getIn(['data', 'hornetq', 'type'], '<unknown>');
    return 'HornetQ ' + label;
  }
});
