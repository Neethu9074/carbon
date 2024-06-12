/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

// @ts-expect-error Module needs to be translated to TS
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error Module needs to be translated to TS
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { businessPerspectiveDashboard, businessPerspectiveSummaryPath } from 'in-bizops/navigation/paths';
import { getBusinessProcessListData } from 'in-bizops/lists/businessProcess/BusinessProcessList';
import { processColumnDefinitions } from 'in-bizops/lists/businessProcess/columnDefinitions';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

const pathSegment = businessPerspectiveSummaryPath;
const matrixPrefix = '';

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions: processColumnDefinitions,
    title: t('in-bizops:lists.noData'),
    description: t('in-bizops:lists.noData')
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions: processColumnDefinitions,
  defaultOrderBy: 'process_name',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function Processes() {
  const timeConfig = useTimeConfig();
  const location = useLocation();

  const perspectiveName =
    getMatrixParameter(location, businessPerspectiveDashboard, 'perspectiveName') ??
    t('in-bizops:dashboards.summary.pageTitle');

  return (
    <ServerTableWithUrlState cardTitle={perspectiveName} get={getBusinessProcessListData} timeConfig={timeConfig} />
  );
}
