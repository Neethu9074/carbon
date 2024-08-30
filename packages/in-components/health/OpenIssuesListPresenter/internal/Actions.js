/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/legacy';

import { isLoading, hasError } from 'in-services/util/result';
import { getButtonKindBySeverity } from 'in-stores/events';
import { t } from 'in-i18n';

import locals from './Actions.mless';

export default function Actions({ openIssuesResult, analyzeLink, getIssueLink, eventType }) {
  if (isLoading(openIssuesResult) || hasError(openIssuesResult)) {
    return null;
  }

  const eventTypeContext = eventType.toLowerCase();
  const openIssues = openIssuesResult.data;
  const types = openIssues.map(item => item.type);
  const isCVEIssue = types.includes('cve_issue');
  const eventTypeLabel = t('in-components:health.eventType', { context: eventTypeContext, count: openIssues.length });

  if (openIssues.length === 0) {
    const buttonText = isCVEIssue
      ? t('in-components:vulnerabilities.openIssuesListPresenterActionsViewIssues', {
          eventTypeLabel
        })
      : t('in-components:health.openIssuesListPresenterActionsViewIssues', {
          eventTypeLabel
        });

    return (
      <div className={locals.actions}>
        <Button
          icon={isCVEIssue ? 'lib_events_cve' : 'lib_events_inverted'}
          kind="primary"
          className={locals.button}
          href={analyzeLink}
        >
          {buttonText}
        </Button>
      </div>
    );
  }

  const maxSeverity = openIssues[0].problem.severity;

  let href = analyzeLink;
  if (openIssues.length === 1) {
    href = getIssueLink(openIssues[0].id);
  }

  const buttonText = isCVEIssue
    ? t('in-components:vulnerabilities.openIssuesListPresenterActionsViewNumbersOfIssue', {
        openIssueCount: openIssues.length,
        eventTypeLabel
      })
    : t('in-components:health.openIssuesListPresenterActionsViewNumbersOfIssue', {
        openIssueCount: openIssues.length,
        eventTypeLabel
      });

  return (
    <div className={locals.actions}>
      <Button
        icon={isCVEIssue ? 'lib_events_cve' : 'lib_help_error_warning'}
        kind={getButtonKindBySeverity(maxSeverity)}
        className={locals.button}
        asBlock
        href={href}
      >
        {buttonText}
      </Button>
    </div>
  );
}
