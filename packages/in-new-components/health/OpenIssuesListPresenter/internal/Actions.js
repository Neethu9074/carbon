/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { getButtonKindBySeverity } from 'in-stores/events';
import Button from 'in-new-components/Button';

import locals from './Actions.mless';

export default function Actions({ openIssuesResult, analyzeLink$, getIssueLink, eventType }) {
  const openIssues = openIssuesResult.data;
  if (openIssues == null || openIssues.length === 0) {
    return (
      <div className={locals.actions}>
        <Button icon="lib_events_inverted" kind="primary" className={locals.button} asBlock href$={analyzeLink$}>
          View {eventType + 's'}
        </Button>
      </div>
    );
  }

  const maxSeverity = openIssues[0].problem.severity;

  let href$ = analyzeLink$;
  if (openIssues.length === 1) {
    href$ = getIssueLink(openIssues[0].id);
  }

  return (
    <div className={locals.actions}>
      <Button
        icon="lib_help_error_warning"
        kind={getButtonKindBySeverity(maxSeverity)}
        className={locals.button}
        asBlock
        href$={href$}
      >
        View {openIssues.length} {openIssues.length === 1 ? eventType : eventType + 's'}
      </Button>
    </div>
  );
}
