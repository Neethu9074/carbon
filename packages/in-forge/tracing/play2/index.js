/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getLabel } from 'in-forge/tracing/http/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'play2',
  category: t('in-forge:tracingCategory.http', 'http'),

  detailView: 'Play2SpanDetailView',

  getLabel
});
