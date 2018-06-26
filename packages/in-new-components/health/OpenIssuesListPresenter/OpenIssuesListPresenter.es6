import React from 'react';

import Actions from 'in-new-components/health/OpenIssuesListPresenter/internal/Actions';
import Header from 'in-new-components/health/OpenIssuesListPresenter/internal/Header';
import Issues from 'in-new-components/health/OpenIssuesListPresenter/internal/Issues';
import { compare } from 'in-services/util/number';

const maxIssuesToShow = 10;

export default function OpenIssuesListPresenter({ openIssues }) {
  openIssues = openIssues.slice().sort((a, b) => compare(b.problem.severity, a.problem.severity));

  return (
    <section>
      <Header openIssues={openIssues} maxIssuesToShow={maxIssuesToShow} />
      <Issues openIssues={openIssues} maxIssuesToShow={maxIssuesToShow} />
      <Actions openIssues={openIssues} maxIssuesToShow={maxIssuesToShow} />
    </section>
  );
}
