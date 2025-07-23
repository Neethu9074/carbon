/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useState } from 'react';
import React from 'react';

import { useObservable } from '@instana/hooks';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { newAccountAndBillingPageEnabled } from 'in-services/featureFlags';
import { getActiveLicensesAsResultObservable } from 'in-amp/api/account';
import LicenseCarbonTable from 'in-amp/components/LicenseCarbonTable';
import { formatDate } from 'in-services/formatters/date';
import { isLoading } from 'in-services/util/result';
import { t } from 'in-i18n';

export const columnDefinitions = [
  {
    id: 'name',
    label: t('in-amp:components.activeLicenses.name'),
    sortable: false,
    getContent(item) {
      return <span>{item.unit}</span>;
    }
  },
  {
    id: 'tenant',
    label: t('in-amp:components.activeLicenses.tenant'),
    sortable: false,
    getContent(item) {
      return <span>{item.tenant}</span>;
    }
  },
  {
    id: 'type',
    label: t('in-amp:components.activeLicenses.type'),
    sortable: false,
    getContent(item) {
      return <span>{item.license.name}</span>;
    }
  },
  {
    id: 'start',
    label: t('in-amp:components.activeLicenses.licenseStartData'),
    sortable: false,
    getContent(item) {
      return <span>{formatDate(item.license.start)}</span>;
    }
  },
  {
    id: 'expire',
    label: t('in-amp:components.activeLicenses.licenseEndData'),
    sortable: false,
    getContent(item) {
      return <span>{formatDate(item.license.expire)}</span>;
    }
  },
  {
    id: 'amp',
    label: t('in-amp:components.activeLicenses.licensedApmHosts'),
    sortable: false,
    getContent(item) {
      return <span>{item.license.licenseSpecs?.apmHosts ?? valueMissingPlaceholder}</span>;
    }
  },
  {
    id: 'infra',
    label: t('in-amp:components.activeLicenses.licensedIqmHosts'),
    sortable: false,
    getContent(item) {
      return <span>{item.license.licenseSpecs?.infraHosts ?? valueMissingPlaceholder}</span>;
    }
  }
];

const LicenseTable = createServerTableWithUrlState({
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions,
  pathSegment: '/usage',
  defaultPageSize: 5,
  defaultOrderBy: 'start',
  defaultOrderDirection: 'DESC',
  isSearchable: false,
  matrixPrefix: 'a.'
});

export default function ActiveLicenses() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const result = useObservable(() => getActiveLicensesAsResultObservable(page, pageSize), [page, pageSize]);

  const rows = mapLicenseResultToRows(result);

  const totalItems = result?.data?.totalHits ?? 0;
  return newAccountAndBillingPageEnabled ? (
    <LicenseCarbonTable
      title={t('in-amp:accountAndBilling.tabs.activeEntitlements')}
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
    <LicenseTable get={({ page, pageSize }) => getActiveLicensesAsResultObservable(page, pageSize)} />
  );
}

export function mapLicenseResultToRows(result) {
  return (
    result?.data?.items?.map((item, index) => ({
      id: `${index}`,
      name: item.unit,
      tenant: item.tenant,
      type: item.license.name,
      start: formatDate(item.license.start),
      expire: formatDate(item.license.expire),
      amp: item.license.licenseSpecs?.apmHosts ?? valueMissingPlaceholder,
      infra: item.license.licenseSpecs?.infraHosts ?? valueMissingPlaceholder
    })) ?? []
  );
}
