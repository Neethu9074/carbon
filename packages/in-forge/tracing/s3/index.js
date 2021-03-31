/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 's3',
  category: t('in-forge:tracingCategory.database'),

  detailView: 'S3SpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 's3', 'op']) + ' ' + span.getIn(['data', 's3', 'bucket']);
  }
});
