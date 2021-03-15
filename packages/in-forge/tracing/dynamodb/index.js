/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'dynamodb',
  category: 'database',

  typeName: {
    singular: t('in-forge:tracing.dynamoDB.indexName'),
    plural: t('in-forge:tracing.dynamoDB.indexName_plural')
  },

  detailView: 'DynamoDBSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'dynamodb', 'op']) + ' ' + span.getIn(['data', 'dynamodb', 'table']);
  }
});
