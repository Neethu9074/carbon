/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { OrderDirection, TagFilter, TagFilterExpression, TimeConfig } from '@instana/types';

import {
  CurrentLocationsState,
  FilterLocationState,
  filterLocationTypesUrlStateDefinition,
  locationTypesUrlParameter
} from 'in-synthetics/utils/constants';
// @ts-expect-error Module needs to be translated to TS
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error Module needs to be translated to TS
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import columnDefinitions from 'in-synthetics/dashboards/global/tabs/locations/components/columnDefinitions';
import ViewSwitcher from 'in-synthetics/dashboards/global/tabs/tests/components/ViewSwitcher';
import Filters from 'in-synthetics/dashboards/global/tabs/locations/components/Filters';
import { CONTAINS, EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import NewLocationButton from 'in-synthetics/createLocation/NewLocationButton';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { locationNameTagName, locationTypeTagName } from 'in-synthetics/tags';
import { syntheticInstanaHostedPoPEnabled } from 'in-services/featureFlags';
import getLocationList from 'in-synthetics/subscriptions/getLocationList';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useUrlState from 'in-hooks/useUrlState';
import Sticky from 'in-components/Sticky';
import Footer from 'in-components/Footer';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

const pathSegment = '/syntheticLocations';
const matrixPrefix = 'location.';

const urlStateDefinition = {
  bind: filterLocationTypesUrlStateDefinition.bind,
  reducer: (prevState: FilterLocationState, { locationTypes }: CurrentLocationsState) => ({
    locationTypes: locationTypes || prevState.locationTypes
  })
};

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions: columnDefinitions,
    title: t('in-synthetics:dashboard.noDataAvailable.locationListTitle'),
    description: t('in-synthetics:dashboard.noDataAvailable.locationListDescription')
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters, locationTypesUrlParameter],
  columnDefinitions: columnDefinitions,
  defaultOrderBy: 'location_name',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

interface PresenterProps {
  locationTypes: string[];
  isFilterAllowed: boolean;
  setFilter: (change: Partial<{ locationTypes: string[] }>) => void;
}

function Filter({ locationTypes, isFilterAllowed, setFilter }: PresenterProps) {
  if (!isFilterAllowed) {
    return undefined;
  } else {
    return <Filters setFilter={setFilter} locationTypes={locationTypes} />;
  }
}

export default function LocationList() {
  const timeConfig = useTimeConfig();
  const [{ locationTypes }, setFilter] = useUrlState(urlStateDefinition);

  function useFilterHeader(isFilterAllowed: boolean) {
    return Filter({ locationTypes, isFilterAllowed, setFilter });
  }

  function RightHeader() {
    const filterHeader = useFilterHeader(true);
    return (
      <>
        {role?.canConfigureSyntheticLocations && syntheticInstanaHostedPoPEnabled && <NewLocationButton />}
        {filterHeader}
      </>
    );
  }

  return (
    <Sticky header={<ViewSwitcher />}>
      <LeftRightPadding>
        <ViewTrackingMeta
          data={{
            productArea: productAreas.synthetic_monitoring,
            pageRootName: pageNames.locations
          }}
        />
        <ServerTableWithUrlState
          get={getLocationData}
          timeConfig={timeConfig}
          rightHeader={RightHeader}
          locationTypes={locationTypes}
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
  locationTypes?: string[];
};

export function getLocationData({
  timeConfig,
  orderBy = 'location_name',
  orderDirection = 'ASC',
  page = 1,
  pageSize = 1,
  query = '',
  locationTypes = []
}: GetLocationData) {
  let baseTagFilters: TagFilter[] = [];
  let tagFilterExpression: TagFilterExpression = {
    elements: [],
    logicalOperator: 'OR',
    type: 'EXPRESSION'
  };

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

  if (locationTypes.length !== 0 && Array.isArray(locationTypes)) {
    locationTypes.forEach(type => {
      tagFilterExpression.elements.push({
        value: type,
        name: locationTypeTagName,
        operator: EQUALS,
        entity: NOT_APPLICABLE,
        type: 'TAG_FILTER'
      });
    });
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
    tagFilters: baseTagFilters,
    tagFilterExpression
  });
}
