/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { HorizontalIndicator } from '@instana/components';
import { LoadingSkeleton } from '@instana/components';

import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import Issue from 'in-components/health/OpenIssuesListPresenter/internal/Issue';

import locals from './Issues.mless';

export default function Issues({ openIssuesResult, maxIssuesToShow, getIssueLink }) {
  if (openIssuesResult.progress.loading) {
    return (
      <div>
        <HorizontalIndicator progress={openIssuesResult.progress} />
        <LoadingSkeleton className={locals.skeleton} />
        <LoadingSkeleton className={locals.skeleton} />
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
