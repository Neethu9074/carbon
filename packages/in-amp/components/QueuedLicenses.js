/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useState } from 'react';
import React from 'react';

import { useObservable } from '@instana/hooks';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { columnDefinitions, mapLicenseResultToRows } from 'in-amp/components/ActiveLicenses';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { newAccountAndBillingPageEnabled } from 'in-services/featureFlags';
import { getQueuedLicensesAsResultObservable } from 'in-amp/api/account';
import LicenseCarbonTable from 'in-amp/components/LicenseCarbonTable';
import { isLoading } from 'in-services/util/result';
import { t } from 'in-i18n';

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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const result = useObservable(() => getQueuedLicensesAsResultObservable(page, pageSize), [page, pageSize]);

  const rows = mapLicenseResultToRows(result);

  const totalItems = result?.data?.totalHits ?? 0;
  return newAccountAndBillingPageEnabled ? (
    <LicenseCarbonTable
      title={t('in-amp:accountAndBilling.tabs.queuedEntitlements')}
      rows={rows}
      page={page}
      pageSize={pageSize}
      totalItems={totalItems}
      isLoading={isLoading(result)}
      onPaginationChange={(newPage, newSize) => {
        setPage(newPage);
        setPageSize(newSize);
      }}
    />
  ) : (
    <QueuedLicenseTable get={({ page, pageSize }) => getQueuedLicensesAsResultObservable(page, pageSize)} />
  );
}
