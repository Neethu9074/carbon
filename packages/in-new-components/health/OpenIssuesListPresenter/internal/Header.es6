import React from 'react';

import locals from './Header.mless';

export default function Header({ openIssues, maxIssuesToShow }) {
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
