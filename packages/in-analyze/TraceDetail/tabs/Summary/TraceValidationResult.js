/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Message from 'in-new-components/Message';

import locals from './TraceValidationResult.mless';

export const issueMessages = {
  multiple_root_spans: 'The trace is malformed and contains multiple root calls',
  missing_root_span: 'The root call of the trace is missing or has not yet arrived in the processing pipeline.',
  duplicated_spans: 'The trace contains duplicated calls with the same id.',
  too_many_spans: 'The trace contains too many calls, it can only be partially displayed and downloaded.',
  missing_parent_span: 'Parent span is missing for some of the entry spans in this trace during the processing.',
  exit_spans_followed_by_intermediate_spans: 'Some exit spans are followed by intermediate spans.'
};

export default function TraceValidationResult({ issues }) {
  if (issues && issues.length > 0) {
    return (
      <div className={locals.messageWrapper}>
        {issues.map(issueKey => (
          <Message key={issueKey} withIcon title={issueMessages[issueKey] ? issueMessages[issueKey] : issueKey} />
        ))}
      </div>
    );
  } else {
    return null;
  }
}
