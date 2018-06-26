import React from 'react';

import Issue from 'in-new-components/health/OpenIssuesListPresenter/internal/Issue';

import locals from './Issues.mless';

export default function Issues({ openIssues, maxIssuesToShow }) {
  return (
    <ol className={locals.issues}>
      {openIssues.slice(0, maxIssuesToShow).map(issue => <Issue key={issue.id} issue={issue} />)}
    </ol>
  );
}
