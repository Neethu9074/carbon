/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'aws.lambda.invoke',

  detailView: 'AwsLambdaInvokeDetailView',

  getLabel(span) {
    return span.getIn(['data', 'aws', 'lambda', 'invoke', 'function']);
  }
});
