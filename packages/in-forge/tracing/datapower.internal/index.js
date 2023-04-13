/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'datapower.internal',
  category: t('in-forge:tracingCategory.http'),
  detailView: 'DataPowerInternalSpanDetailView',
  getLabel(span) {
    const method = span.getIn(['data', 'http', 'method'], '<unknown_method>');
    const path = span.getIn(['data', 'http', 'path'], '<unknown_path>');

    return `${method} ${path}`;
  }
});
