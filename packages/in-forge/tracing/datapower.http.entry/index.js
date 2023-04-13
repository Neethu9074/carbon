/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { getLabel } from 'in-forge/tracing/http/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'datapower.http.entry',
  category: t('in-forge:tracingCategory.http'),
  detailView: 'DataPowerEntrySpanDetailView',
  getLabel
});
