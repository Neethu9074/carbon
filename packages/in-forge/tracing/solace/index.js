/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'solace',
  category: t('in-forge:tracingCategory.messaging'),

  detailView: 'SolaceSpanDetailView',

  getLabel(span) {
    return `${span.getIn(['data', 'solace', 'op'])} ${span.getIn(['data', 'solace', 'destination'])}`;
  }
});
