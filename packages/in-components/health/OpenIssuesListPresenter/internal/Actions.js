/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Button } from '@instana/components';

import { useVulnerabilityTracker } from 'in-events/useVulnerabilityTracker';
import { carbonButtonEnabled } from 'in-services/featureFlags';
import { isLoading, hasError } from 'in-services/util/result';
import { getButtonKindBySeverity } from 'in-stores/events';
import { t } from 'in-i18n';

import locals from './Actions.mless';

export default function Actions({ openIssuesResult, analyzeLink, getIssueLink, eventType }) {
  const { trackViewAllVulnerabilitiesInContainerDashboard } = useVulnerabilityTracker();

  if (isLoading(openIssuesResult) || hasError(openIssuesResult)) {
    return null;
  }

  const eventTypeContext = eventType.toLowerCase();
  const openIssues = openIssuesResult.data;
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
          icon={carbonButtonEnabled ? undefined : isCVEIssue ? 'lib_events_cve' : 'lib_events_inverted'}
          size={carbonButtonEnabled ? 'compact' : 'normal'}
          kind={carbonButtonEnabled ? 'secondary' : 'primary'}
          className={carbonButtonEnabled ? locals.carbonButton : locals.button}
          href={analyzeLink}
          onClick={handleClick}
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
        icon={carbonButtonEnabled ? undefined : isCVEIssue ? 'lib_events_cve' : 'lib_help_error_warning'}
        kind={carbonButtonEnabled ? 'secondary' : getButtonKindBySeverity(maxSeverity)}
        size={carbonButtonEnabled ? 'compact' : 'normal'}
        className={carbonButtonEnabled ? locals.carbonButton : locals.button}
        asBlock
        href={href}
        onClick={handleClick}
      >
        {buttonText}
      </Button>
    </div>
  );
}
