/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import classNames from 'classnames';

import { SvgIcon, Pill } from '@instana/components';
import { Link } from '@instana/components';

import { getDesignLibraryColorBySeverity, getDesignLibrarySeverityIcon } from 'in-stores/events';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { formatDateTime } from 'in-services/formatters/date';
import { toHtml } from 'in-services/formatters/markdown';
import { issueClickTracker } from 'in-components/tracker';
import { t } from 'in-i18n';

import locals from './Issue.mless';

const MAX_PROBLEM_TEXT_LENGTH = 1000;

export default function Issue({ issue, getIssueLink }) {
  const severity = issue.problem.severity;
  const color = getDesignLibraryColorBySeverity(severity);
  const type = getDesignLibrarySeverityIcon(severity);

  let content = (
    <Fragment>
      <div className={locals.stripe} style={{ background: color }}>
        <SvgIcon type="lib_arrow_right" color="#fff" className={locals.stripeIcon} />
      </div>

      <h2 className={locals.title}>
        <SvgIcon
          type={type}
          color={color}
          size="s"
          className={classNames({
            [locals.icon]: true,
            [locals.iconWarning]: !(severity > 5) && severity !== 0
          })}
        />
        {issue.problem.problemText}
      </h2>

      <div className={locals.description}>
        {issue.problem.fixSuggestion.length > MAX_PROBLEM_TEXT_LENGTH ? (
          <span className={locals.descriptionTooLong}>
            {t('in-components:health.openIssuesListPresenterIssueDescriptionOmitted')}
          </span>
        ) : (
          <DangerousHtmlPresenter html={toHtml(issue.problem.fixSuggestion)} />
        )}
      </div>

      <div className={locals.timeSection}>
        <Pill kind="lighter">{t('in-components:health.openIssuesListPresenterStarted')}</Pill>
        <time dateTime={new Date(issue.start).toISOString()} className={locals.startTime}>
          {formatDateTime(issue.start)}
        </time>
      </div>
    </Fragment>
  );

  if (getIssueLink) {
    const issueHref = getIssueLink(issue.id);
    content = (
      <Link href={issueHref} className={locals.link} onClick={() => issueClickTracker({ path: issueHref })}>
        {content}
      </Link>
    );
  }

  return (
    <li
      className={classNames({
        [locals.issue]: true,
        [locals.clickable]: getIssueLink != null
      })}
    >
      {content}
    </li>
  );
}
