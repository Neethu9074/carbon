/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import Issue from 'in-new-components/health/OpenIssuesListPresenter/internal/Issue';
import HorizontalIndicator from 'in-new-components/Loading/HorizontalIndicator';
import Skeleton from 'in-new-components/Loading/Skeleton';

import locals from './Issues.mless';

export default function Issues({ openIssuesResult, maxIssuesToShow, getIssueLink }) {
  if (openIssuesResult.progress.loading) {
    return (
      <div>
        <HorizontalIndicator progress={openIssuesResult.progress} />
        <Skeleton className={locals.skeleton} />
        <Skeleton className={locals.skeleton} />
      </div>
    );
  }

  if (openIssuesResult.errors.length > 0) {
    return <ErroneousResultPresenter errors={openIssuesResult.errors} className={locals.errors} />;
  }

  const openIssues = openIssuesResult.data;

  return (
    <ol className={locals.issues}>
      {openIssues.slice(0, maxIssuesToShow).map(issue => (
        <Issue key={issue.id} getIssueLink={getIssueLink} issue={issue} />
      ))}
    </ol>
  );
}
