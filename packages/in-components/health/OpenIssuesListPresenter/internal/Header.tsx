/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment, ReactElement, ReactNode } from 'react';

import { IconButton } from '@instana/carbon';

import { OpenIssuesResult } from 'in-components/health/OpenIssuesListPresenter';
import { t } from 'in-i18n';

import locals from './Header.mless';

interface HeaderProps {
  openIssuesResult: OpenIssuesResult;
  maxIssuesToShow: number;
  eventType: string;
  close?: () => void;
}

export default function Header({ openIssuesResult, maxIssuesToShow, eventType }: HeaderProps): ReactElement | null {
  if (!openIssuesResult || !openIssuesResult.data) {
    return null;
  }
  const eventTypeContext = eventType.toLowerCase();
  const isCVEIssue = openIssuesResult.data.some(item => item.type === 'cve_issue');

  let title: ReactNode = null;
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

    title = (
      <Fragment>
        {headerText}
        {openIssueCount > maxIssuesToShow && (
          <span className={locals.more}>
            {t('in-components:health.openIssuesListPresenterHeaderDisplayingMaxIssuesToShowMostSevere', {
              maxIssuesToShow: maxIssuesToShow
            })}
          </span>
        )}
      </Fragment>
    );
  }

  return (
    <h1 className={locals.header}>
      <div className={locals.title}>{title}</div>
      <IconButton
        /* @ts-expect-error this kind does not exist on button, and will be fixed in a follow-up */
        kind="action"
        /* @ts-expect-error this type does not exist on button, and will be fixed in a follow-up */
        type="lib_openclose_cancel"
        size="xl"
        className={locals.close}
        onClick={close}
      />
    </h1>
  );
}
