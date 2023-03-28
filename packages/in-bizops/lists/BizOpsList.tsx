/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { just } from '@instana/observables';

// @ts-expect-error Module needs to be translated to TS
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error Module needs to be translated to TS
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { processColumnDefinitions } from './definitions/columnDefinitions';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import ViewSwitcher from 'in-bizops/components/ViewSwitcher';
import { bizOpsPath } from 'in-bizops/navigation/paths';
import { listSuccess } from 'in-services/util/result';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

const pathSegment = bizOpsPath;
const matrixPrefix = '';

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions: processColumnDefinitions,
    title: t('in-bizops:lists.noData'),
    description: t('in-bizops:lists.noData')
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions: processColumnDefinitions,
  defaultOrderBy: 'process_id',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function BizOpsList() {
  const timeConfig = useTimeConfig();

  return (
    <Sticky header={<ViewSwitcher />}>
      <LeftRightPadding>
        <Title title={t('in-bizops:labelBizOps')} />
        <ViewTrackingMeta
          data={{
            productArea: 'BizOps',
            pageRootName: 'BizOps'
          }}
        />
        <ServerTableWithUrlState get={getProcessData} timeConfig={timeConfig} cardTitle={t('in-bizops:labelBizOps')} />
      </LeftRightPadding>

      <Footer />
    </Sticky>
  );
}

// Currently not getting data
export function getProcessData() {
  return just(listSuccess([]));
}
