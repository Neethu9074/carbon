import React from 'react';

import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { getDesignLibraryColorBySeverity } from 'in-stores/events';
import { toHtml } from 'in-services/formatters/markdown';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Issue.mless';

const MAX_PROBLEM_TEXT_LENGTH = 1000;

export default function Issue({ issue }) {
  const color = getDesignLibraryColorBySeverity(issue.problem.severity);
  return (
    <li className={locals.issue}>
      <div className={locals.stripe} style={{ background: color }} />

      <h2 className={locals.title}>
        <SvgIcon type="lib_events_inverted" width={24} color={color} className={locals.icon} />
        {issue.problem.problemText}
      </h2>

      <p className={locals.description}>
        {issue.problem.fixSuggestion.length > MAX_PROBLEM_TEXT_LENGTH ? (
          <span className={locals.descriptionTooLong}>
            Issue description omitted. More details are visible within the {`event's`} detail view.
          </span>
        ) : (
          <DangerousHtmlPresenter html={toHtml(issue.problem.fixSuggestion)} />
        )}
      </p>
    </li>
  );
}
