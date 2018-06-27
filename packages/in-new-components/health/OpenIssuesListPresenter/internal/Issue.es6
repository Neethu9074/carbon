import React, { Fragment } from 'react';

import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { getDesignLibraryColorBySeverity } from 'in-stores/events';
import { evaluateClassNames } from 'in-services/util/classnames';
import { toHtml } from 'in-services/formatters/markdown';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './Issue.mless';

const MAX_PROBLEM_TEXT_LENGTH = 1000;

export default function Issue({ issue, getIssueLink }) {
  const color = getDesignLibraryColorBySeverity(issue.problem.severity);

  let content = (
    <Fragment>
      <div className={locals.stripe} style={{ background: color }} />

      <h2 className={locals.title}>
        <SvgIcon type="lib_events_inverted" width={24} color={color} className={locals.icon} />
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
      className={evaluateClassNames({
        [locals.issue]: true,
        [locals.clickable]: getIssueLink != null
      })}
    >
      {content}
    </li>
  );
}
