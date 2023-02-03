/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'ims.mq.exit',
  category: t('in-forge:tracingCategory.messaging'),

  detailView: 'ImsMqExitDetailView',

  getLabel(span) {
    return span.getIn(['data', 'mq', 'queue'], t('in-forge:tracing.ims.titleUnknown'));
  }
});
