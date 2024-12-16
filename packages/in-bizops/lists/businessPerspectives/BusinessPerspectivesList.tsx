/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { OrderDirection, TagFilterExpression, TimeConfig } from '@instana/types';
import { Button } from '@instana/components';

// @ts-expect-error Module needs to be translated to TS
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error Module needs to be translated to TS
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { NewPerspectiveDialogPresenter } from 'in-bizops/lists/businessPerspectives/creation/NewPerspectiveDialogPresenter';
import { perspectiveColumnDefinitions } from 'in-bizops/lists/businessPerspectives/columnDefinitions';
import getBusinessPerspectives from 'in-bizops/subscriptions/getBusinessPerspectives';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { businessPerspectivesPath } from 'in-bizops/navigation/paths';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { productAreas } from 'in-services/tracking/productAreas';
import { bizopsCreatePerspectiveClick } from 'in-bizops/tracker';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import ViewSwitcher from 'in-bizops/components/ViewSwitcher';
import { pageNames } from 'in-services/tracking/pageNames';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from 'in-bizops/lists/businessPerspectives/BusinessPerspectivesList.mless';

const pathSegment = businessPerspectivesPath;
const matrixPrefix = '';

function NewPerspectiveButton() {
  const { location } = useNavigation();
  const trackerProps = {
    path: location.pathname
  };

  const createDisabled = role?.limitedBizOpsScope;

  if (createDisabled) return <></>;
  return (
    <Button
      kind="action"
      onClick={() => {
        bizopsCreatePerspectiveClick(trackerProps);
        addActiveDialog(<NewPerspectiveDialogPresenter />);
      }}
      className={locals.button}
      icon="lib_openclose_add_circle_outline"
    >
      {t('in-bizops:perspectives.newPerspective')}
    </Button>
  );
}

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions: perspectiveColumnDefinitions,
    title: t('in-bizops:lists.noData'),
    description: t('in-bizops:lists.noData')
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions: perspectiveColumnDefinitions,
  defaultOrderBy: 'business.perspective.name',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function BusinessPerspectivesList() {
  const timeConfig = useTimeConfig();

  return (
    <div className={locals.perspectiveList}>
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
            get={getBusinessPerspectivesListData}
            timeConfig={timeConfig}
            cardTitle={t('in-bizops:perspectives.lists.perspectives')}
            rightHeader={NewPerspectiveButton}
          />
        </LeftRightPadding>
        <Footer />
      </Sticky>
    </div>
  );
}

type GetBusinessPerspectiveList = {
  timeConfig: TimeConfig;
  orderBy?: string;
  orderDirection?: OrderDirection;
  page: number;
  pageSize: number;
  query: string;
};

function getBusinessPerspectivesListData({
  timeConfig,
  orderBy = 'process_name',
  orderDirection = 'ASC',
  page = 1,
  pageSize = 10,
  query = ''
}: GetBusinessPerspectiveList) {
  let tagFilterExpression: TagFilterExpression = {
    type: 'EXPRESSION',
    logicalOperator: 'AND',
    elements: []
  };

  // search against business_perspective_name
  if (query && query.length > 0) {
    tagFilterExpression.elements.push({
      name: 'business.perspective.name',
      operator: 'CONTAINS',
      stringValue: query,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    });
  }

  return getBusinessPerspectives({
    pagination: {
      page,
      pageSize
    },
    order: { by: orderBy, direction: orderDirection },
    dataType: 'PERSPECTIVE',
    metrics: {
      business_process_definitions_count: {
        metric: 'business_process_definitions_count',
        granularity: 0,
        aggregation: 'DISTINCT_COUNT'
      },
      openIssues: {
        metric: 'openIssues',
        granularity: 0,
        aggregation: 'DISTINCT_COUNT'
      },
      maxSeverity: {
        metric: 'maxSeverity',
        granularity: 0,
        aggregation: 'MAX'
      }
    },
    timeConfig,
    tagFilterExpression
  });
}
