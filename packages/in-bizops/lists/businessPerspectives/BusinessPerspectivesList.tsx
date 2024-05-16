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
import { perspectiveColumnDefinitions } from 'in-bizops/lists/businessPerspectives/columnDefinitions';
import { getBusinessProcessListData } from '../businessProcess/BusinessProcessList';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { businessPerspectivesPath } from 'in-bizops/navigation/paths';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import ViewSwitcher from 'in-bizops/components/ViewSwitcher';
import { pageNames } from 'in-services/tracking/pageNames';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

const pathSegment = businessPerspectivesPath;
const matrixPrefix = '';

// TODO:  change this to perspectives data when backend is ready
const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions: perspectiveColumnDefinitions,
    title: t('in-bizops:lists.noData'),
    description: t('in-bizops:lists.noData')
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions: perspectiveColumnDefinitions,
  defaultOrderBy: 'process_name',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function BusinessPerspectivesList() {
  const timeConfig = useTimeConfig();

  return (
    <Sticky header={<ViewSwitcher />}>
      <LeftRightPadding>
        <Title title={t('in-bizops:lists.pageTitle')} />
        <ViewTrackingMeta
          data={{
            productArea: productAreas.bizops,
            pageRootName: pageNames.bizops_perspectives
          }}
        />
        <ServerTableWithUrlState
          // TODO:  change this to perspectives data when backend is ready
          get={getBusinessProcessListData}
          timeConfig={timeConfig}
          cardTitle={t('in-bizops:lists.perspectives')}
        />
      </LeftRightPadding>
      <Footer />
    </Sticky>
  );
}
