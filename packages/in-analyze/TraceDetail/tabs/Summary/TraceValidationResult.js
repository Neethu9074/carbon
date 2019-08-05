import React from 'react';

import Message from 'in-new-components/Message';
import SvgIcon from 'in-components/SvgIcon';

import locals from './TraceValidationResult.mless';

const issueMessages = {
  multiple_root_spans: 'The trace is malformed and contains multiple root calls',
  missing_root_span: 'The root call of the trace is missing or has not yet arrived in the processing pipeline.',
  duplicated_spans: 'The trace contains duplicated calls with the same id.',
  too_many_spans: 'The trace contains too many calls, it can only be partially displayed and downloaded.',
  missing_parent_span: 'Parent span is missing for some of the entry spans in this trace during the processing.',
  database_parent_spans:
    'Some calls are malformed: they are built from a pair of exit/entry spans where the exit span represents a database call.'
};

export default function TraceValidationResult({ issues }) {
  if (issues && issues.length > 0) {
    return (
      <Message className={locals.messageWrapper}>
        <div className={locals.contentWrapper}>
          <SvgIcon className={locals.icon} type={'lib_help_error_error_outline'} />
          <div className={locals.messages}>
            {issues.map(issueKey => (
              <div key={issueKey}>{issueMessages[issueKey] ? issueMessages[issueKey] : issueKey}</div>
            ))}
          </div>
        </div>
      </Message>
    );
  } else {
    return null;
  }
}
