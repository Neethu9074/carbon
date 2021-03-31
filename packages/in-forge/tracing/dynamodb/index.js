/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'dynamodb',
  category: t('in-forge:tracingCategory.database'),

  detailView: 'DynamoDBSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'dynamodb', 'op']) + ' ' + span.getIn(['data', 'dynamodb', 'table']);
  }
});
