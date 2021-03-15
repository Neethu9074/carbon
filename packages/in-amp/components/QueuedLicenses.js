/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { getQueuedLicensesAsResultObservable } from 'in-amp/api/account';
import { columnDefinitions } from 'in-amp/components/ActiveLicenses';

const QueuedLicenseTable = createServerTableWithUrlState({
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions,
  pathSegment: '/usage',
  defaultPageSize: 5,
  defaultOrderBy: 'start',
  defaultOrderDirection: 'DESC',
  isSearchable: false,
  matrixPrefix: 'q.'
});

export default function QueuedLicenses() {
  return <QueuedLicenseTable get={({ page, pageSize }) => getQueuedLicensesAsResultObservable(page, pageSize)} />;
}
