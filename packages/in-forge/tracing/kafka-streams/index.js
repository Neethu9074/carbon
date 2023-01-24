/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'kafka-streams',
  category: t('in-forge:tracingCategory.messaging'),

  detailView: 'KafkaStreamSpanDetailView',

  getLabel(span) {
    return `${span.getIn(['data', 'kafka-streams', 'access'])} ${span.getIn(['data', 'kafka-streams', 'function'])}`;
  }
});
