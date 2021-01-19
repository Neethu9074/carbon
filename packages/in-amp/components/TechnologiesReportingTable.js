/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { ampTechnologies } from 'in-settings/navigation/paths';
import { number } from 'in-services/formatters/number';

import locals from './TechnologiesReportingTable.mless';

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    getContent(item) {
      return <span className={locals.label}>{item.name}</span>;
    }
  },
  {
    id: 'min',
    label: 'Min',
    getContent(item) {
      return <span>{item.min}</span>;
    }
  },
  {
    id: 'max',
    label: 'Max',
    getContent(item) {
      return <span>{item.max}</span>;
    }
  },
  {
    id: 'avg',
    label: 'Average',
    getContent(item) {
      return <span>{number.compact(item.average)}</span>;
    }
  }
];

export const TechnologiesReportingTable = createServerTableWithUrlState({
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions,
  pathSegment: ampTechnologies,
  defaultPageSize: 10,
  defaultOrderBy: 'name',
  defaultOrderDirection: 'ASC',
  isSearchable: false
});
export default TechnologiesReportingTable;
