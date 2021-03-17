/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  // we do not define a category since Lambda entries can belong to different categories depending on the trigger - they
  // can be HTTP entries, or messaging entries, or event entries or batch entries.

  type: 'aws.lambda.entry',

  detailView: 'AwsLambdaEntryDetailView',

  getLabel(span) {
    const functionName = span.getIn(['data', 'lambda', 'functionName']);
    const functionVersion = span.getIn(['data', 'lambda', 'functionVersion']);
    const arn = span.getIn(['data', 'lambda', 'arn']);
    if (functionName && functionVersion) {
      return functionName + ':' + functionVersion;
    }
    if (functionName) {
      return functionName;
    }
    if (arn) {
      return arn;
    }
    return null;
  }
});
