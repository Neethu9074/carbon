/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'dynamodb',
  category: 'database',

  typeName: {
    singular: 'DynamoDB call',
    plural: 'DynamoDB calls'
  },

  detailView: 'DynamoDBSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'dynamodb', 'op']) + ' ' + span.getIn(['data', 'dynamodb', 'table']);
  }
});
