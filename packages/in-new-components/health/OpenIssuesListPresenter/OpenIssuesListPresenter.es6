import React from 'react';

import Actions from 'in-new-components/health/OpenIssuesListPresenter/internal/Actions';
import Header from 'in-new-components/health/OpenIssuesListPresenter/internal/Header';
import Issues from 'in-new-components/health/OpenIssuesListPresenter/internal/Issues';
import { compare } from 'in-services/util/number';
import { mapData } from 'in-services/util/result';

const maxIssuesToShow = 10;

export default function OpenIssuesListPresenter({ openIssuesResult, analyzeLink$ }) {
  openIssuesResult = mapData(openIssuesResult, openIssues =>
    openIssues.slice().sort((a, b) => compare(b.problem.severity, a.problem.severity))
  );

  return (
    <section>
      <Header openIssuesResult={openIssuesResult} maxIssuesToShow={maxIssuesToShow} />
      <Issues openIssuesResult={openIssuesResult} maxIssuesToShow={maxIssuesToShow} />
      <Actions openIssuesResult={openIssuesResult} maxIssuesToShow={maxIssuesToShow} analyzeLink$={analyzeLink$} />
    </section>
  );
}
