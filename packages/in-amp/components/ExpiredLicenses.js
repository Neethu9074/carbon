/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { getExpiredLicensesAsResultObservable } from 'in-amp/api/account';
import { columnDefinitions } from 'in-amp/components/ActiveLicenses';

const QueuedLicenseTable = createServerTableWithUrlState({
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions,
  pathSegment: '/usage',
  defaultPageSize: 5,
  defaultOrderBy: 'start',
  defaultOrderDirection: 'DESC',
  isSearchable: false,
  matrixPrefix: 'e.'
});

export default function ExpiredLicenses() {
  return <QueuedLicenseTable get={({ page, pageSize }) => getExpiredLicensesAsResultObservable(page, pageSize)} />;
}
