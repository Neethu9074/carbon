/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Result, SyntheticTest, TimeConfig } from '@instana/types';
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
  locationsUrlParameter,
  defaultRunType
} from 'in-synthetics/utils/constants';
// @ts-expect-error
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { TestsTableWithUrlState } from 'in-synthetics/dashboards/global/tabs/tests/components/TestsTableWithUrlState';
// @ts-expect-error
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import getColumnDefinitions from 'in-synthetics/dashboards/global/tabs/tests/components/columnDefinitions';
import { getTestSummaryListData } from 'in-synthetics/dashboards/global/TestSummaryList';
import getServerTableDescription from 'in-synthetics/utils/getServerTableDescription';
import Filters from 'in-synthetics/dashboards/global/tabs/tests/components/Filters';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { syntheticSslImprovementEnabled } from 'in-services/featureFlags';
import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import { pendingResult } from 'in-services/fixedObjects';
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

function ServerTableWithUrlState(props: Parameters<typeof createServerTableWithUrlState>[0]) {
  const [role] = useCurrentUserRole();
  const columnDefinitions = getColumnDefinitions(role);
  const Component = createServerTableWithUrlState({
    Renderer: withEmptyTableState({
      columnDefinitions: columnDefinitions.filter(
        column => !['applicationLabels', 'applicationLabel'].includes(column.id)
      ),
      title: t('in-websites:websiteDashboard.tabs.synthetic.noDataTitle'),
      description: getServerTableDescription('websites')
    }),
    paginationResettingUrlParameters: [...timeConfigUrlParameters, syntheticTypesUrlParameter, locationsUrlParameter],
    columnDefinitions: columnDefinitions.filter(
      column => !['applicationLabels', 'applicationLabel'].includes(column.id)
    ),
    defaultOrderBy: 'successRate',
    defaultOrderDirection: 'ASC',
    pathSegment,
    matrixPrefix
  });

  return <Component {...props} />;
}

interface Props {
  websiteId: string;
  timeConfig: TimeConfig;
}

const SyntheticMonitoring = ({ websiteId, timeConfig }: Props) => {
  const [{ syntheticTypes, locationIds }, setFilter] = useUrlState(urlStateDefinition);
  const syntheticTests: Result<SyntheticTest[]> = useObservable<any, any[]>(getTests, []) ?? pendingResult;
  // Use the defaultRunType constant
  const runType = defaultRunType;

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
      {syntheticSslImprovementEnabled ? (
        <TestsTableWithUrlState
          isAssociationsContext
          context={'website'}
          websiteId={websiteId}
          syntheticTypes={syntheticTypes}
          locationIds={locationIds}
          {...(runType ? { runType } : {})}
          syntheticTests={syntheticTests}
          timeConfig={timeConfig}
          setFilter={setFilter}
        />
      ) : (
        <ServerTableWithUrlState
          timeConfig={timeConfig}
          context={'website'}
          websiteId={websiteId}
          rightHeader={rightHeader}
          cardTitle={t('in-synthetics:dashboard.testList.secondaryLabels.tests')}
          get={getTestSummaryListData}
          syntheticTypes={syntheticTypes}
          locationIds={locationIds}
          {...(runType ? { runType } : {})}
        />
      )}
      <Footer />
    </>
  );
};

export default SyntheticMonitoring;
