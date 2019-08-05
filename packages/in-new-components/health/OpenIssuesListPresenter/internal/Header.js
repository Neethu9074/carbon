import React, { Fragment } from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from './Header.mless';

export default function Header({ openIssuesResult, maxIssuesToShow, close }) {
  let title = null;
  if (openIssuesResult.progress.loading) {
    title = 'Loading Open Issues…';
  } else if (openIssuesResult.errors.length > 0) {
    title = 'Failed To Load Open Issues';
  } else {
    const openIssueCount = openIssuesResult.data.length;
    title = (
      <Fragment>
        {openIssueCount} Open {openIssueCount === 1 ? 'Issue' : 'Issues'}
        {openIssueCount > maxIssuesToShow && (
          <span className={locals.more}>(displaying {maxIssuesToShow} most severe)</span>
        )}
      </Fragment>
    );
  }

  return (
    <h1 className={locals.header}>
      <div className={locals.title}>{title}</div>
      <SvgIcon type="lib_openclose_cancel" size="l" className={locals.close} onClick={close} />
    </h1>
  );
}
