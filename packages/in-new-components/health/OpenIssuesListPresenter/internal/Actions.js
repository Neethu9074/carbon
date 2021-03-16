/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { isLoading, hasError } from 'in-services/util/result';
import { getButtonKindBySeverity } from 'in-stores/events';
import Button from 'in-new-components/Button';
import { t } from 'in-i18n';

import locals from './Actions.mless';

export default function Actions({ openIssuesResult, analyzeLink$, getIssueLink, eventType }) {
  if (isLoading(openIssuesResult) || hasError(openIssuesResult)) {
    return null;
  }

  const openIssues = openIssuesResult.data;
  if (openIssues.length === 0) {
    return (
      <div className={locals.actions}>
        <Button icon="lib_events_inverted" kind="primary" className={locals.button} asBlock href$={analyzeLink$}>
          {t('in-new-components:health.openIssuesListPresenterActionsViewIssues', {
            eventType: t('in-new-components:health.eventType' + eventType, { count: openIssues.length })
          })}
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
        {t('in-new-components:health.openIssuesListPresenterActionsViewNumbersOfIssue', {
          openIssueCount: openIssues.length,
          eventType: t('in-new-components:health.eventType' + eventType, { count: openIssues.length })
        })}
      </Button>
    </div>
  );
}
