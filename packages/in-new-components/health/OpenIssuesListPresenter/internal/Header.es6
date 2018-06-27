import React from 'react';

import locals from './Header.mless';

export default function Header({ openIssuesResult, maxIssuesToShow }) {
  if (openIssuesResult.progress.loading) {
    return <h1 className={locals.header}>Loading Open Issues…</h1>;
  }

  if (openIssuesResult.errors.length > 0) {
    return <h1 className={locals.header}>Failed To Load Open Issues</h1>;
  }

  const openIssues = openIssuesResult.data;
  return (
    <h1 className={locals.header}>
      {openIssues.length} Open {openIssues.length === 1 ? 'Issue' : 'Issues'}
      {openIssues.length > maxIssuesToShow && (
        <span className={locals.more}>(displaying {openIssues.length} most severe)</span>
      )}
    </h1>
  );
}
