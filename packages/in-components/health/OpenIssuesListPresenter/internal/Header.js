/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { SvgIcon } from '@instana/components';

import { t } from 'in-i18n';

import locals from './Header.mless';

export default function Header({ openIssuesResult, maxIssuesToShow, eventType, close }) {
  const eventTypeContext = eventType.toLowerCase();

  let title = null;
  if (openIssuesResult.progress.loading) {
    title = t('in-components:health.openIssuesListPresenterHeaderTitleLoadingOpenIssues', {
      eventType: t('in-components:health.eventType', { context: eventTypeContext, count: 2 })
    });
  } else if (openIssuesResult.errors.length > 0) {
    title = t('in-components:health.openIssuesListPresenterHeaderTitleFailedToLoadOpenIssues', {
      eventType: t('in-components:health.eventType', {
        context: eventTypeContext,
        count: openIssuesResult.errors.length
      })
    });
  } else {
    const openIssueCount = openIssuesResult.data.length;
    title = (
      <Fragment>
        {t('in-components:health.openIssuesListPresenterHeaderNumbersOfOpenIssues', {
          openIssueCount: openIssueCount,
          eventType: t('in-components:health.eventType', { context: eventTypeContext, count: openIssueCount })
        })}
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
      <SvgIcon type="lib_openclose_cancel" size="l" className={locals.close} onClick={close} />
    </h1>
  );
}
