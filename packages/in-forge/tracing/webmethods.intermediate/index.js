/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { getLabel } from 'in-forge/tracing/webmethods.intermediate/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'webmethods.intermediate',
  category: t('in-forge:tracingCategory.generic'),

  detailView: 'WebmethodsIntermediateSpanDetailView',

  getLabel
});
