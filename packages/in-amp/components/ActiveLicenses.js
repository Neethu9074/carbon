import React from 'react';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { getActiveLicensesAsResultObservable } from 'in-amp/api/account';
import { formatDate } from 'in-services/formatters/date';

export const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    sortable: false,
    getContent(item) {
      return <span>{item.unit}</span>;
    }
  },
  {
    id: 'tenant',
    label: 'Tenant',
    sortable: false,
    getContent(item) {
      return <span>{item.tenant}</span>;
    }
  },
  {
    id: 'type',
    label: 'Type',
    sortable: false,
    getContent(item) {
      return <span>{item.license.name}</span>;
    }
  },
  {
    id: 'start',
    label: 'License Start Data',
    sortable: false,
    getContent(item) {
      return <span>{formatDate(item.license.start)}</span>;
    }
  },
  {
    id: 'expire',
    label: 'License End Data',
    sortable: false,
    getContent(item) {
      return <span>{formatDate(item.license.expire)}</span>;
    }
  },
  {
    id: 'amp',
    label: 'Licensed AMP Hosts',
    sortable: false,
    getContent(item) {
      return <span>{item.license.licenseSpecs?.apmHosts ?? valueMissingPlaceholder}</span>;
    }
  },
  {
    id: 'infra',
    label: 'Licensed IM Hosts',
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
