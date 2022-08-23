/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useLocation } from 'react-router';
import React from 'react';

import { TestResultListItem } from '@instana/types';
import { t } from '@instana/i18n-react';

// @ts-expect-error
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { columnDefinitions } from 'in-synthetics/dashboards/global/tabs/tests/components/columnDefinitions';
// @ts-expect-error
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { getTestSummaryListData } from 'in-synthetics/dashboards/global/TestSummaryList';
import Filters from 'in-synthetics/dashboards/global/tabs/tests/components/Filters';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Footer from 'in-components/Footer/Footer';

const pathSegment = '/synthetics';
const matrixPrefix = 'synthetic.';

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions: columnDefinitions.filter(column => column.id != 'applicationLabel'),
    title: t('in-synthetics:dashboard.noDataAvailable.testSummaryTitle'),
    description: t('in-synthetics:dashboard.noDataAvailable.testSummaryDescription')
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions: columnDefinitions.filter(column => column.id != 'applicationLabel'),
  defaultOrderBy: 'test_name',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function SyntheticList(props: ServerTablePresenterProps<TestResultListItem>) {
  const timeConfig = useTimeConfig();
  const location = useLocation();
  const appId = getMatrixParameter(location, '/application', 'appId') ?? '';

  const rightHeader = <Filters isAppcontext setFilter props={props} />;

  return (
    <>
      <ServerTableWithUrlState
        timeConfig={timeConfig}
        context={'application'}
        appId={appId}
        rightHeader={rightHeader}
        cardTitle={t('in-synthetics:dashboard.testList.secondaryLabels.tests')}
        get={getTestSummaryListData}
      />
      <Footer />
    </>
  );
}
