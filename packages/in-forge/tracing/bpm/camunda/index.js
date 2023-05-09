/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'camunda',
  category: t('in-forge:tracingCategory.bpm'),

  detailView: 'BPMSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'rootProcess', 'id']);
  }
});
