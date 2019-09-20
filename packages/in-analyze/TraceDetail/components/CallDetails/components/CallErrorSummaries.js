import { get } from 'lodash';
import React from 'react';

import ErrorIndicator from 'in-analyze/TraceDetail/components/ErrorIndicator';
import { shorten } from 'in-services/util/string';
import { find } from 'in-services/arrayUtils';

import locals from './CallErrorSummaries.mless';

export default function CallErrorSummaries({ call, kind }) {
  let span = find(call.spans, _span => _span.kind === kind);
  if (call.errorCount < 1) {
    return null;
  }

  let errorDetails = [];

  // The back end provides an unordered list of span excerpts due to TraceActivityTreeNodeDetailsItemConverter.java
  // using an unordered HashSet, so we examine both spans for the call.
  const statusCode = get(span, ['data', 'http', 'status']) || 0;
  if (statusCode && statusCode >= 500) {
    errorDetails.push(`HTTP Status ${statusCode}`);
  }

  // The back end provides an unordered list of span excerpts due to TraceActivityTreeNodeDetailsItemConverter.java
  // using an unordered HashSet, so we examine both spans for the call.
  const graphQlError =
    get(call.spans[1], ['data', 'graphql', 'errors']) || get(call.spans[0], ['data', 'graphql', 'errors']);
  if (graphQlError) {
    let shortenedGraphQlError = shorten(graphQlError);
    if (shortenedGraphQlError.length < graphQlError.length) {
      shortenedGraphQlError += ' (see below for full error message)';
    }
    errorDetails.push(shortenedGraphQlError);
  }

  if (errorDetails.length === 0) {
    return null;
  }

  return errorDetails.map((errorDetail, idx) => (
    <div className={locals.callErrorDetailsWrapper} key={idx}>
      <ErrorIndicator erroneous={call.errorCount} />
      <div className={locals.callErrorDetails}>{errorDetail}</div>
    </div>
  ));
}
