/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'missing',
  category: t('in-forge:tracingCategory.missing', 'missing'),

  detailView: 'MissingSpanDetailView',

  getLabel() {
    return t('in-forge:tracing.missing.indexLabel');
  }
});
