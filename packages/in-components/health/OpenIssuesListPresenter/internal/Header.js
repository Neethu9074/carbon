/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { IconButton } from '@instana/components';

import { t } from 'in-i18n';

import locals from './Header.mless';

export default function Header({ openIssuesResult, maxIssuesToShow, eventType, close }) {
  if (!openIssuesResult || !openIssuesResult.data) {
    return null;
  }
  const eventTypeContext = eventType.toLowerCase();
  const isCVEIssue = openIssuesResult.data.some(item => item.type === 'cve_issue');

  let title = null;
  if (openIssuesResult.progress.loading) {
    eventType = t('in-components:health.eventType', { context: eventTypeContext, count: 2 });
    title = isCVEIssue
      ? t('in-components:vulnerabilities.openIssuesListPresenterHeaderTitleLoadingOpenIssues', eventType)
      : t('in-components:health.openIssuesListPresenterHeaderTitleLoadingOpenIssues', eventType);
  } else if (openIssuesResult.errors.length > 0) {
    eventType = t('in-components:health.eventType', {
      context: eventTypeContext,
      count: openIssuesResult.errors.length
    });
    title = isCVEIssue
      ? t('in-components:vulnerabilities.openIssuesListPresenterHeaderTitleFailedToLoadOpenIssues', eventType)
      : t('in-components:health.openIssuesListPresenterHeaderTitleFailedToLoadOpenIssues', eventType);
  } else {
    const openIssueCount = openIssuesResult.data.length;
    const eventType = t('in-components:health.eventType', { context: eventTypeContext, count: openIssueCount });
    const headerText = isCVEIssue
      ? t('in-components:vulnerabilities.openIssuesListPresenterHeaderNumbersOfOpenIssues', {
          openIssueCount: openIssueCount,
          eventType
        })
      : t('in-components:health.openIssuesListPresenterHeaderNumbersOfOpenIssues', {
          openIssueCount: openIssueCount,
          eventType
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
      <IconButton kind="action" type="lib_openclose_cancel" size="xl" className={locals.close} onClick={close} />
    </h1>
  );
}
