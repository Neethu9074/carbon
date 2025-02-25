/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'otel-batch-synthetic',
  category: t('in-forge:tracingCategory.batch'),

  detailView: 'OpenTelemetrySyntheticBatchSpanDetailView',

  getLabel() {
    return t('in-forge:tracing.otelBatchSynthetic.indexReturn');
  }
});
