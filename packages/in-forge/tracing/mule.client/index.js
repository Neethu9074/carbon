/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'mule.client',
  category: t('in-forge:tracingCategory.http', 'http'),

  detailView: 'MuleClientSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'mule', 'address']);
  }
});
