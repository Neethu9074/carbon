/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'php.error',
  category: t('in-forge:tracingCategory.logger'),

  detailView: 'PhpErrorSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'error', 'msg']);
  }
});
