/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Result, SyntheticTest } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import {
  CurrentState,
  FilterState,
  filterUrlStateDefinition,
  matrixPrefix,
  pathSegment,
  PresenterProps,
  syntheticTypesUrlParameter,
  locationsUrlParameter
} from 'in-synthetics/utils/constants';
// @ts-expect-error
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import columnDefinitions from 'in-synthetics/dashboards/global/tabs/tests/components/columnDefinitions';
import { getTestSummaryListData } from 'in-synthetics/dashboards/global/TestSummaryList';
import Filters from 'in-synthetics/dashboards/global/tabs/tests/components/Filters';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Footer from 'in-components/Footer/Footer';
import useUrlState from 'in-hooks/useUrlState';
import { getTests } from 'in-synthetics/api';

const urlStateDefinition = {
  bind: filterUrlStateDefinition.bind,
  reducer: (prevState: FilterState, { syntheticTypes, locationIds }: CurrentState) => ({
    syntheticTypes: syntheticTypes || prevState.syntheticTypes,
    locationIds: locationIds || prevState.locationIds
  })
};

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions: columnDefinitions.filter(
      column => !['applicationLabels', 'applicationLabel'].includes(column.id)
    ),
    title: t('in-synthetics:dashboard.noDataAvailable.testSummaryTitle'),
    description: t('in-synthetics:dashboard.noDataAvailable.testSummaryDescription')
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters, syntheticTypesUrlParameter, locationsUrlParameter],
  columnDefinitions: columnDefinitions.filter(column => !['applicationLabels', 'applicationLabel'].includes(column.id)),
  defaultOrderBy: 'successRate',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function SyntheticList() {
  const timeConfig = useTimeConfig();
  const location = useLocation();
  const appId = getMatrixParameter(location, '/application', 'appId') ?? '';
  const [{ syntheticTypes, locationIds }, setFilter] = useUrlState(urlStateDefinition);
  const syntheticTests: Result<SyntheticTest[]> = useObservable<any, any[]>(getTests, []) ?? pendingResult;

  function useFilterHeader(isFilterAllowed: boolean) {
    return function Filter({ syntheticTypes, locationIds }: PresenterProps) {
      if (!isFilterAllowed) {
        return undefined;
      } else {
        return (
          <Filters
            result={syntheticTests}
            setFilter={setFilter}
            isAssociationsContext
            syntheticTypes={syntheticTypes}
            locationIds={locationIds}
          />
        );
      }
    };
  }

  const rightHeader = useFilterHeader(true);

  return (
    <>
      <ServerTableWithUrlState
        timeConfig={timeConfig}
        context={'application'}
        appId={appId}
        rightHeader={rightHeader}
        cardTitle={t('in-synthetics:dashboard.testList.secondaryLabels.tests')}
        get={getTestSummaryListData}
        syntheticTypes={syntheticTypes}
        locationIds={locationIds}
      />
      <Footer />
    </>
  );
}
