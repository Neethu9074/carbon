/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import { t } from 'in-i18n';

import SvgIcon from 'in-components/SvgIcon';

import locals from './Header.mless';

export default function Header({ openIssuesResult, maxIssuesToShow, eventType, close }) {
  let title = null;
  if (openIssuesResult.progress.loading) {
    title = t('in-new-components:health.openIssuesListPresenterHeaderTitleLoadingOpenIssues', {
      eventType: t('in-new-components:health.eventType' + eventType, { count: 2 })
    });
  } else if (openIssuesResult.errors.length > 0) {
    title = t('in-new-components:health.openIssuesListPresenterHeaderTitleFailedToLoadOpenIssues', {
      eventType: t('in-new-components:health.eventType' + eventType, { count: openIssuesResult.errors.length })
    });
  } else {
    const openIssueCount = openIssuesResult.data.length;
    title = (
      <Fragment>
        {t('in-new-components:health.openIssuesListPresenterHeaderNumbersOfOpenIssues', {
          openIssueCount: openIssueCount,
          eventType: t('in-new-components:health.eventType' + eventType, { count: openIssueCount })
        })}
        {openIssueCount > maxIssuesToShow && (
          <span className={locals.more}>
            {t('in-new-components:health.openIssuesListPresenterHeaderDisplayingMaxIssuesToShowMostSevere', {
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
