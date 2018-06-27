import React from 'react';

import locals from './Header.mless';

export default function Header({ openIssuesResult, maxIssuesToShow }) {
  if (openIssuesResult.progress.loading) {
    return <h1 className={locals.header}>Loading open issues…</h1>;
  }

  if (openIssuesResult.errors.length > 0) {
    return <h1 className={locals.header}>Failed to load open issues</h1>;
  }

  const openIssues = openIssuesResult.data;

  if (openIssues.length > maxIssuesToShow) {
    return (
      <h1 className={locals.header}>
        most severe {maxIssuesToShow} open issues <span className={locals.more}>(out of {openIssues.length})</span>
      </h1>
    );
  }

  return (
    <h1 className={locals.header}>
      {openIssues.length} open {openIssues.length === 1 ? 'issue' : 'issues'}
    </h1>
  );
}
