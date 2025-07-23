/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactElement } from 'react';

import { Button } from '@instana/carbon';

import { OpenIssuesResult } from 'in-components/health/OpenIssuesListPresenter';
import { useVulnerabilityTracker } from 'in-events/useVulnerabilityTracker';
import { isLoading, hasError } from 'in-services/util/result';
import { t } from 'in-i18n';

import locals from './Actions.mless';

interface ActionsProps {
  openIssuesResult: OpenIssuesResult;
  analyzeLink?: string;
  getIssueLink?: (issueId: string) => string;
  eventType: string;
  maxIssuesToShow?: number;
}

export default function Actions({
  openIssuesResult,
  analyzeLink,
  getIssueLink,
  eventType
}: ActionsProps): ReactElement | null {
  const { trackViewAllVulnerabilitiesInContainerDashboard } = useVulnerabilityTracker();

  if (isLoading(openIssuesResult) || hasError(openIssuesResult)) {
    return null;
  }

  const eventTypeContext = eventType.toLowerCase();
  const openIssues = openIssuesResult.data ?? [];
  const types = openIssues.map(item => item.type);
  const isCVEIssue = types.includes('cve_issue');
  const eventTypeLabel = t('in-components:health.eventType', { context: eventTypeContext, count: openIssues.length });

  const handleClick = () => {
    if (isCVEIssue) {
      trackViewAllVulnerabilitiesInContainerDashboard();
    }
  };

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
          /* @ts-expect-error this will be fixed in the carbon migration in the follow-up */
          size="compact"
          kind="secondary"
          className={locals.carbonButton}
          href={analyzeLink}
          onClick={handleClick}
        >
          {buttonText}
        </Button>
      </div>
    );
  }

  let href = analyzeLink;
  if (openIssues.length === 1 && getIssueLink) {
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
        kind="secondary"
        /* @ts-expect-error this will be fixed in the carbon migration in the follow-up */
        size="compact"
        className={locals.carbonButton}
        asBlock
        href={href}
        onClick={handleClick}
      >
        {buttonText}
      </Button>
    </div>
  );
}
