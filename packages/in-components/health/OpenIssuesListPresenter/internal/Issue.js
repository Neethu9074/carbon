/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import classNames from 'classnames';

import { SvgIcon } from '@instana/components';
import { Link } from '@instana/components';

import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { getDesignLibraryColorBySeverity } from 'in-stores/events';
import { formatDateTime } from 'in-services/formatters/date';
import { toHtml } from 'in-services/formatters/markdown';
import Pill from 'in-new-components/Pill';
import { t } from 'in-i18n';

import locals from './Issue.mless';

const MAX_PROBLEM_TEXT_LENGTH = 1000;

export default function Issue({ issue, getIssueLink }) {
  const color = getDesignLibraryColorBySeverity(issue.problem.severity);

  let content = (
    <Fragment>
      <div className={locals.stripe} style={{ background: color }}>
        <SvgIcon type="lib_arrow_right" color="#fff" className={locals.stripeIcon} />
      </div>

      <h2 className={locals.title}>
        <SvgIcon type="lib_help_error_warning" color={color} className={locals.icon} />
        {issue.problem.problemText}
      </h2>

      <div className={locals.description}>
        {issue.problem.fixSuggestion.length > MAX_PROBLEM_TEXT_LENGTH ? (
          <span className={locals.descriptionTooLong}>
            {t('in-new-components:health.openIssuesListPresenterIssueDescriptionOmitted')}
          </span>
        ) : (
          <DangerousHtmlPresenter html={toHtml(issue.problem.fixSuggestion)} />
        )}
      </div>

      <div className={locals.timeSection}>
        <Pill kind="lighter">{t('in-new-components:health.openIssuesListPresenterStarted')}</Pill>
        <time dateTime={new Date(issue.start).toISOString()} className={locals.startTime}>
          {formatDateTime(issue.start)}
        </time>
      </div>
    </Fragment>
  );

  if (getIssueLink) {
    content = (
      <Link href$={getIssueLink(issue.id)} className={locals.link}>
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
