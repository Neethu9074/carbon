/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getLabel } from 'in-forge/tracing/http/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'sdk.http.entry',
  category: t('in-forge:tracingCategory.http'),

  detailView: 'HttpEntrySpanDetailView',

  getLabel
});
