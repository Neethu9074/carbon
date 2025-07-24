/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { StructuredListSkeleton, ContainedList } from '@instana/carbon';

import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import Issue from 'in-components/health/OpenIssuesListPresenter/internal/Issue';
import { OpenIssuesResult } from 'in-components/health/OpenIssuesListPresenter';

import locals from './Issues.mless';

interface IssuesProps {
  openIssuesResult: OpenIssuesResult;
  maxIssuesToShow: number;
  getIssueLink?: (issueId: string) => string;
}

export default function Issues({ openIssuesResult, maxIssuesToShow, getIssueLink }: IssuesProps): React.ReactElement {
  if (openIssuesResult?.progress?.loading) {
    return <StructuredListSkeleton rowCount={2} className={locals.loading} />;
  }

  if (openIssuesResult?.errors && openIssuesResult.errors.length > 0) {
    return <ErroneousResultPresenter errors={openIssuesResult.errors} className={locals.errors} />;
  }

  const openIssues = openIssuesResult.data || [];

  return (
    <div className={locals.issues}>
      <ContainedList kind="on-page" action="" label="">
        {openIssues.slice(0, maxIssuesToShow).map(issue => (
          <Issue key={issue.id} issue={issue} getIssueLink={getIssueLink ? () => getIssueLink(issue.id) : undefined} />
        ))}
      </ContainedList>
    </div>
  );
}
