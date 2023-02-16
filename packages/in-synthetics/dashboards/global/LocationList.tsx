/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { OrderDirection, TagFilter, TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error Module needs to be translated to TS
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { columnDefinitions } from 'in-synthetics/dashboards/global/tabs/locations/components/columnDefinitions';
// @ts-expect-error Module needs to be translated to TS
import Sticky from 'in-components/Sticky';
import ViewSwitcher from 'in-synthetics/dashboards/global/tabs/tests/components/ViewSwitcher';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { CONTAINS } from 'in-components/QueryBuilder/tagFilter/operators';
import getLocationList from 'in-synthetics/subscriptions/getLocationList';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { locationNameTagName } from 'in-synthetics/tags';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

const pathSegment = '/syntheticLocation';
const matrixPrefix = '';

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions: columnDefinitions,
    title: t('in-synthetics:dashboard.noDataAvailable.locationListTitle'),
    description: t('in-synthetics:dashboard.noDataAvailable.locationListDescription')
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions: columnDefinitions,
  defaultOrderBy: 'location_name',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function LocationList() {
  const timeConfig = useTimeConfig();

  return (
    <Sticky header={<ViewSwitcher />}>
      <LeftRightPadding>
        <ViewTrackingMeta
          data={{
            productArea: 'Synthetic Monitoring',
            pageRootName: 'Synthetic Location'
          }}
        />
        <ServerTableWithUrlState
          get={getLocationData}
          timeConfig={timeConfig}
          cardTitle={t('in-synthetics:dashboard.testList.secondaryLabels.locations')}
        />
      </LeftRightPadding>
      <Footer />
    </Sticky>
  );
}

type GetLocationData = {
  timeConfig: TimeConfig;
  orderBy: string;
  orderDirection: OrderDirection;
  page: number;
  pageSize: number;
  query: string;
};

export function getLocationData({
  timeConfig,
  orderBy = 'location_name',
  orderDirection = 'ASC',
  page = 1,
  pageSize = 1,
  query = ''
}: GetLocationData) {
  let baseTagFilters: TagFilter[] = [];
  if (query && query.length > 0) {
    baseTagFilters = [
      {
        stringValue: query,
        name: locationNameTagName,
        operator: CONTAINS,
        entity: NOT_APPLICABLE,
        type: 'TAG_FILTER'
      }
    ];
  }

  return getLocationList({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      timeConfig,
      includeInternalCalls: false,
      includeSyntheticCalls: false,
      useLongTermDataOnly: false
    },
    tagFilters: baseTagFilters
  });
}
