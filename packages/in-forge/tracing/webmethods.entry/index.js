/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { getLabel } from 'in-forge/tracing/webmethods.entry/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'webmethods.entry',
  category: t('in-forge:tracingCategory.http'),

  detailView: 'WebmethodsEntrySpanDetailView',

  getLabel
});
