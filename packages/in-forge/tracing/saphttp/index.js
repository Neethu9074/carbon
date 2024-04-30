/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import { getLabel } from 'in-forge/tracing/saphttp/SpanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'saphttp',
  category: t('in-forge:tracingCategory.http'),
  detailView: 'SapSpanDetailView',

  getLabel
});
