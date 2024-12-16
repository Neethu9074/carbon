/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { getLabel } from 'in-forge/tracing/saprfc/SpanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'saprfc',
  category: t('in-forge:tracingCategory.rfc'),
  detailView: 'SapSpanDetailView',

  getLabel
});
