/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'kafka',
  category: t('in-forge:tracingCategory.messaging', 'messaging'),

  detailView: 'KafkaSpanDetailView',

  getLabel(span) {
    return `${span.getIn(['data', 'kafka', 'access'])} ${span.getIn(['data', 'kafka', 'service'])}`;
  }
});
