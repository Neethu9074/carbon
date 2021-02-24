/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import Message from 'in-new-components/Message';

import locals from './TraceValidationResult.mless';

export const issueMessages = {
  multiple_root_spans: t('in-analyze:tabs.summary.messageMultiple_root_spans'),
  missing_root_span: t('in-analyze:tabs.summary.messageMissing_root_span'),
  duplicated_spans: t('in-analyze:tabs.summary.messageDuplicated_spans'),
  too_many_spans: t('in-analyze:tabs.summary.messageToo_many_spans'),
  missing_parent_span: t('in-analyze:tabs.summary.messageMissing_parent_span'),
  exit_spans_followed_by_intermediate_spans: t('in-analyze:tabs.summary.messageExit_spans_followed_by_intermediate_spans')
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
