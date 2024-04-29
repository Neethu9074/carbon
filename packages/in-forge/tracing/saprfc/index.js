/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
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
