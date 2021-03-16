/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import SearchInput from 'in-new-components/SearchInput';
import Card from 'in-new-components/Card';

import locals from './DashboardSection.mless';

export default function DashboardSection({ title, children, button, searchable }) {
  return (
    <div className={locals.dashboardSection}>
      <Card title={title} header={headerContent(button, searchable)}>
        {children}
      </Card>
    </div>
  );
}

const headerContent = (button, searchable) => (
  <Fragment>
    {button}
    {searchable ? <SearchInput maxWidth={140} /> : null}
  </Fragment>
);
