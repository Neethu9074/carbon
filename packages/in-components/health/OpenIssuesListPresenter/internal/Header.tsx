/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Typography } from '@instana/components';

import { OpenIssuesResult } from 'in-components/health/OpenIssuesListPresenter';
import { t } from 'in-i18n';

import locals from './Header.mless';

interface HeaderProps {
  openIssuesResult: OpenIssuesResult;
  maxIssuesToShow: number;
  eventType: string;
  close?: () => void;
}

export default function Header({ openIssuesResult, eventType }: HeaderProps): React.ReactElement | null {
  if (!openIssuesResult || !openIssuesResult.data) {
    return null;
  }
  const eventTypeContext = eventType.toLowerCase();
  const isCVEIssue = openIssuesResult.data.some(item => item.type === 'cve_issue');

  let title: React.ReactNode = null;
  if (openIssuesResult?.progress?.loading) {
    const eventTypeLabel = t('in-components:health.eventType', { context: eventTypeContext, count: 2 });
    title = isCVEIssue
      ? t('in-components:vulnerabilities.openIssuesListPresenterHeaderTitleLoadingOpenIssues', eventTypeLabel)
      : t('in-components:health.openIssuesListPresenterHeaderTitleLoadingOpenIssues', eventTypeLabel);
  } else if (openIssuesResult.errors && openIssuesResult.errors.length > 0) {
    const eventTypeLabel = t('in-components:health.eventType', {
      context: eventTypeContext,
      count: openIssuesResult.errors.length
    });
    title = isCVEIssue
      ? t('in-components:vulnerabilities.openIssuesListPresenterHeaderTitleFailedToLoadOpenIssues', eventTypeLabel)
      : t('in-components:health.openIssuesListPresenterHeaderTitleFailedToLoadOpenIssues', eventTypeLabel);
  } else {
    const openIssueCount = openIssuesResult.data.length;
    const eventTypeLabel = t('in-components:health.eventType', { context: eventTypeContext, count: openIssueCount });
    const headerText = isCVEIssue
      ? t('in-components:vulnerabilities.openIssuesListPresenterHeaderNumbersOfOpenIssues', {
          openIssueCount: openIssueCount,
          eventType: eventTypeLabel
        })
      : t('in-components:health.openIssuesListPresenterHeaderNumbersOfOpenIssues', {
          openIssueCount: openIssueCount,
          eventType: eventTypeLabel
        });

    title = <Typography variant="label-01">{headerText}</Typography>;
  }

  return (
    <header>
      <div className={locals.header}>{title}</div>
    </header>
  );
}
