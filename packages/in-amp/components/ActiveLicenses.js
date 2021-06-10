/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { getActiveLicensesAsResultObservable } from 'in-amp/api/account';
import { formatDate } from 'in-services/formatters/date';
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
  return <LicenseTable get={({ page, pageSize }) => getActiveLicensesAsResultObservable(page, pageSize)} />;
}
