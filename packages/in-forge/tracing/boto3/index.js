/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'boto3',
  category: t('in-forge:tracingCategory.http', 'http'),

  detailView: 'Boto3SpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'boto3', 'op']);
  }
});
