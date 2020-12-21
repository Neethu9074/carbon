import React, { Fragment } from 'react';

import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { getDesignLibraryColorBySeverity } from 'in-stores/events';
import classNames from 'classnames';
import { formatDateTime } from 'in-services/formatters/date';
import { toHtml } from 'in-services/formatters/markdown';
import SvgIcon from 'in-components/SvgIcon';
import Pill from 'in-new-components/Pill';
import Link from 'in-components/Link';

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
            Issue description omitted. More details are visible within the {`event's`} detail view.
          </span>
        ) : (
          <DangerousHtmlPresenter html={toHtml(issue.problem.fixSuggestion)} />
        )}
      </div>

      <div className={locals.timeSection}>
        <Pill kind="lighter">Started</Pill>
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
