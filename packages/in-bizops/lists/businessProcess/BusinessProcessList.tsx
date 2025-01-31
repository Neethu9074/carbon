/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { OrderDirection, TagCatalog, TagFilterExpressionElementUnion, TimeConfig } from '@instana/types';
import { Card, SvgIcon, Button } from '@instana/components';
import { useObservable } from '@instana/hooks';

// @ts-expect-error Module needs to be translated to TS
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error Module needs to be translated to TS
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
// @ts-expect-error Module needs to be translated to TS
import { validateFormModel } from 'in-components/QueryBuilder/validation/formModel';
import BusinessProcessQueryBuilder from 'in-bizops/lists/businessPerspectives/components/BusinessProcessQueryBuilder';
import getBusinessProcessesWithDefaults from 'in-bizops/subscriptions/helpers/getBusinessProcessesWithDefaults';
import BizOpsEmptyTableState from 'in-bizops/lists/businessProcess/components/BizOpsEmptyTableState';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { processColumnDefinitions } from 'in-bizops/lists/businessProcess/columnDefinitions';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { bizopsStandardInclusionEnabled } from 'in-services/featureFlags';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getBusinessMonitoringTagCatalog } from 'in-bizops/api/catalog';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { businessProcessPath } from 'in-bizops/navigation/paths';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import ViewSwitcher from 'in-bizops/components/ViewSwitcher';
import { pageNames } from 'in-services/tracking/pageNames';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

import locals from './BusinessProcessList.mless';

const pathSegment = businessProcessPath;
const matrixPrefix = '';
const hostCount = window.instana?.reportingData?.hostCount;

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

export default function BizOpsList() {
  const timeConfig = useTimeConfig();

  // Properly creating the URL for the Deploy Agent button
  const { createHref, location } = useNavigation();
  const agentInstallationPath = '/agents/installation';
  location.pathname = agentInstallationPath;

  const [queryTagFilter, setQueryTagFilter] = useState([]);
  const tagCatalog = useObservable(getBusinessMonitoringTagCatalog({ useCase: 'FILTERING' }), []);

  const CustomServerTableWithUrlState = createServerTableWithUrlState({
    Renderer: BizOpsEmptyTableState({
      columnDefinitions: processColumnDefinitions,
      href: createHref(location)
    }),
    paginationResettingUrlParameters: [...timeConfigUrlParameters],
    columnDefinitions: processColumnDefinitions,
    defaultOrderBy: 'process_name',
    defaultOrderDirection: 'ASC',
    pathSegment,
    matrixPrefix
  });

  function onClear() {
    setQueryTagFilter([]);
  }

  return (
    <div className={locals.processList}>
      <Sticky header={<ViewSwitcher />}>
        <LeftRightPadding>
          <Title title={t('in-bizops:lists.pageTitle')} />
          <ViewTrackingMeta
            data={{
              productArea: productAreas.bizops,
              pageRootName: pageNames.bizops_processes
            }}
          />
          <Card className={locals.queryCard}>
            <div className={locals.querySection}>
              <label className={locals.queryLabel}>
                <SvgIcon type={'lib_actions_filter'} />
                <span className={locals.queryText}>Filter</span>
              </label>
              <div className={locals.processQueryBuilder}>
                <BusinessProcessQueryBuilder
                  value={queryTagFilter}
                  onChange={(tagFilterExpression: any) => {
                    setQueryTagFilter(tagFilterExpression);
                  }}
                />
              </div>
              {tagCatalog?.data && isQueryValid(tagCatalog?.data, queryTagFilter) && (
                <div className={locals.clearButton}>
                  <Button kind="subtle" icon="lib_openclose_cancel" size="compact" onClick={onClear}>
                    {t('in-components:queryBuilder.workspaceButtonClear')}
                  </Button>
                </div>
              )}
            </div>
          </Card>
          {bizopsStandardInclusionEnabled && typeof hostCount === 'number' && hostCount < 1 ? (
            <CustomServerTableWithUrlState
              get={getBusinessProcessListData}
              timeConfig={timeConfig}
              cardTitle={t('in-bizops:lists.cardTitle')}
              queryTagFilter={queryTagFilter}
              tagCatalog={tagCatalog?.data}
            />
          ) : (
            <ServerTableWithUrlState
              get={getBusinessProcessListData}
              timeConfig={timeConfig}
              cardTitle={t('in-bizops:lists.cardTitle')}
              queryTagFilter={queryTagFilter}
              tagCatalog={tagCatalog?.data}
            />
          )}
        </LeftRightPadding>
        <Footer />
      </Sticky>
    </div>
  );
}

type GetBusinessProcessList = {
  timeConfig: TimeConfig;
  orderDirection?: OrderDirection;
  orderBy?: string;
  page?: number;
  pageSize?: number;
  query?: string;
  queryTagFilter?: FormModelElement[];
  tagCatalog?: TagCatalog;
  tagFilterExpressionElements?: TagFilterExpressionElementUnion[];
};

export function getBusinessProcessListData({
  timeConfig,
  orderDirection,
  orderBy,
  page,
  pageSize,
  query = '',
  queryTagFilter = [],
  tagCatalog = { tagTree: [], tags: [] },
  tagFilterExpressionElements = []
}: GetBusinessProcessList) {
  if (isQueryValid(tagCatalog, queryTagFilter)) {
    tagFilterExpressionElements.push(toBackendQueryModel(queryTagFilter));
  }
  return getBusinessProcessesWithDefaults({
    timeConfig,
    query,
    tagFilterExpressionElements,
    orderDirection,
    orderBy,
    page,
    pageSize
  });
}

function isQueryValid(tagCatalog: TagCatalog, queryTagFilter: FormModelElement[]) {
  if (queryTagFilter.length > 0 && validateFormModel({ tagCatalog: tagCatalog, formModel: queryTagFilter }).isValid) {
    return true;
  }
  return false;
}
