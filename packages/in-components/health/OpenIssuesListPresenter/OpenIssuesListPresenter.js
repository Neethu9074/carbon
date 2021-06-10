/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Actions from 'in-components/health/OpenIssuesListPresenter/internal/Actions';
import Header from 'in-components/health/OpenIssuesListPresenter/internal/Header';
import Issues from 'in-components/health/OpenIssuesListPresenter/internal/Issues';
import { compare } from 'in-services/util/number';
import { mapData } from 'in-services/util/result';

const maxIssuesToShow = 10;

export default function OpenIssuesListPresenter({
  openIssuesResult,
  analyzeLink$,
  getIssueLink,
  close,
  eventType = 'Issue'
}) {
  openIssuesResult = mapData(openIssuesResult, openIssues =>
    openIssues.slice().sort((a, b) => compare(b.problem.severity, a.problem.severity))
  );

  return (
    <section>
      <Header
        openIssuesResult={openIssuesResult}
        maxIssuesToShow={maxIssuesToShow}
        close={close}
        eventType={eventType}
      />
      <Issues openIssuesResult={openIssuesResult} maxIssuesToShow={maxIssuesToShow} getIssueLink={getIssueLink} />
      <Actions
        openIssuesResult={openIssuesResult}
        maxIssuesToShow={maxIssuesToShow}
        analyzeLink$={analyzeLink$}
        getIssueLink={getIssueLink}
        eventType={eventType}
      />
    </section>
  );
}
