/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'cics.mq.exit',
  category: t('in-forge:tracingCategory.messaging'),

  detailView: 'CicsMqExitDetailView',

  getLabel(span) {
    return span.getIn(['data', 'mq', 'queue'], t('in-forge:tracing.cics.titleUnknown'));
  }
});
