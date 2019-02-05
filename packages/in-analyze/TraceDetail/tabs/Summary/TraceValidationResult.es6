import React from 'react';

import Message from 'in-new-components/Message';
import SvgIcon from 'in-components/SvgIcon';

import locals from './TraceValidationResult.mless';

const issueMessages = {
  multiple_root_spans: 'The trace is malformed and contains multiple root spans',
  missing_root_span: 'The root span of the trace is missing or has not yet arrived in the processing pipeline.',
  duplicated_spans: 'The trace contains duplicated spans with the same id.',
  too_many_spans: 'The trace contains too many spans, it is only partially retrieved.'
};

export default function TraceValidationResult({ issues }) {
  if (issues && issues.length > 0) {
    return (
      <Message className={locals.messageWrapper}>
        <div className={locals.contentWrapper}>
          <SvgIcon className={locals.icon} type={'lib_help_error_error_outline'} width={24} height={24} />
          <div className={locals.messages}>
            {issues.map(issueKey => (
              <div>{issueMessages[issueKey] ? issueMessages[issueKey] : issueKey}</div>
            ))}
          </div>
        </div>
      </Message>
    );
  } else {
    return null;
  }
}
