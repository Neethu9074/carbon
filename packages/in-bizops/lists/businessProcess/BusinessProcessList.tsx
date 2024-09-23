/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { MetricConfiguration, OrderDirection, TagCatalog, TagFilterExpression, TimeConfig } from '@instana/types';
import { Card, SvgIcon, Button } from '@instana/components';
import { useObservable } from '@instana/hooks';

// @ts-expect-error Module needs to be translated to TS
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error Module needs to be translated to TS
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
// @ts-expect-error Module needs to be translated to TS
import { validateFormModel } from 'in-components/QueryBuilder/validation/formModel';
import BusinessProcessQueryBuilder from 'in-bizops/lists/businessPerspectives/components/BusinessProcessQueryBuilder';
import { bizopsPerspectivesEnabled, bizopsStandardInclusionEnabled } from 'in-services/featureFlags';
import BizOpsEmptyTableState from 'in-bizops/lists/businessProcess/components/BizOpsEmptyTableState';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { processColumnDefinitions } from 'in-bizops/lists/businessProcess/columnDefinitions';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import getBusinessProcessList from 'in-bizops/subscriptions/getBusinessProcessList';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getBusinessMonitoringTagCatalog } from 'in-bizops/api/catalog';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { businessProcessPath } from 'in-bizops/navigation/paths';
import { productAreas } from 'in-services/tracking/productAreas';
import { getChartGranularity } from 'in-stores/metric/metric';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import ViewSwitcher from 'in-bizops/components/ViewSwitcher';
import { pageNames } from 'in-services/tracking/pageNames';
import { bizopsDeployAgentClick } from 'in-bizops/tracker';
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
  const tagCatalog = useObservable(getBusinessMonitoringTagCatalog(), []);

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

  function DeployAgentButton() {
    if (typeof hostCount === 'number' && hostCount > 0) {
      return null;
    }
    const trackerProps = {
      path: location.pathname,
      location: 'table header bar'
    };
    return (
      <Button
        kind="action"
        href={createHref(location)}
        className={locals.button}
        icon="lib_actions_settings"
        onClick={() => bizopsDeployAgentClick(trackerProps)}
      >
        {t('in-bizops:processes.deployAgent')}
      </Button>
    );
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
          {bizopsPerspectivesEnabled && (
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
          )}
          {bizopsStandardInclusionEnabled && typeof hostCount === 'number' && hostCount < 1 ? (
            <CustomServerTableWithUrlState
              get={getBusinessProcessListData}
              timeConfig={timeConfig}
              cardTitle={t('in-bizops:lists.cardTitle')}
              queryTagFilter={queryTagFilter}
              tagCatalog={tagCatalog?.data}
              rightHeader={DeployAgentButton}
            />
          ) : (
            <ServerTableWithUrlState
              get={getBusinessProcessListData}
              timeConfig={timeConfig}
              cardTitle={t('in-bizops:lists.cardTitle')}
              queryTagFilter={queryTagFilter}
              tagCatalog={tagCatalog?.data}
              rightHeader={DeployAgentButton}
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
  orderBy?: string;
  orderDirection?: OrderDirection;
  page: number;
  pageSize: number;
  query: string;
  queryTagFilter: FormModelElement[];
  tagCatalog: TagCatalog;
};

export function getBusinessProcessListData({
  timeConfig,
  orderBy = 'process_name',
  orderDirection = 'ASC',
  page = 1,
  pageSize = 20,
  query = '',
  queryTagFilter = [],
  tagCatalog = { tagTree: [], tags: [] }
}: GetBusinessProcessList) {
  const sparkChartGranularity = getChartGranularity(timeConfig);

  const started_processes_total: MetricConfiguration = {
    metric: 'started_processes',
    granularity: 0,
    aggregation: 'DISTINCT_COUNT'
  };

  const started_processes_array: MetricConfiguration = {
    metric: 'started_processes',
    granularity: sparkChartGranularity,
    aggregation: 'DISTINCT_COUNT'
  };

  let tagFilterExpression: TagFilterExpression = {
    type: 'EXPRESSION',
    logicalOperator: 'AND',
    elements: []
  };

  // hide any entry with blank process name
  tagFilterExpression.elements.push({
    name: 'bpm_process_definition_name',
    operator: 'NOT_EQUAL',
    value: '',
    entity: NOT_APPLICABLE,
    type: 'TAG_FILTER'
  });

  //search against bpm_process_definition_name
  if (query && query.length > 0) {
    tagFilterExpression.elements.push({
      name: 'bpm_process_definition_name',
      operator: 'CONTAINS',
      stringValue: query,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    });
  }

  // add the tag filters from the query builder after validation
  if (isQueryValid(tagCatalog, queryTagFilter)) {
    let queryFilterExpression = toBackendQueryModel(queryTagFilter);
    tagFilterExpression.elements.push(queryFilterExpression);
  }

  return getBusinessProcessList({
    pagination: {
      page,
      pageSize
    },
    order: { by: orderBy, direction: orderDirection },
    dataType: 'PROCESS',
    metrics: {
      started_processes_total: started_processes_total,
      started_processes_array: started_processes_array
    },
    timeConfig,
    tagFilterExpression
  });
}

function isQueryValid(tagCatalog: TagCatalog, queryTagFilter: FormModelElement[]) {
  if (queryTagFilter.length > 0 && validateFormModel({ tagCatalog: tagCatalog, formModel: queryTagFilter }).isValid) {
    return true;
  }
  return false;
}
