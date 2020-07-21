import React, { useState } from 'react';

import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import ApiQueryAction from 'in-new-components/QueryBuilder/workspace/ApiQueryAction/ApiQueryAction';
import { ActionSection, Action } from 'in-new-components/workspace/ActionSection/ActionSection';
import QueryBuilder, { isQueryValid } from 'in-infrastructure/Explore/components/QueryBuilder';
import QueryBuilderSection from 'in-new-components/QueryBuilder/workspace/QueryBuilderSection';
import InfraPageHeaderWithTabs from 'in-infrastructure/components/InfraPageHeaderWithTabs';
import { tagFilterExpressionMatrixParameter } from 'in-infrastructure/navigation/paths';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { themes } from 'in-new-components/DashboardHeader/DashboardHeader';
import SearchBar from 'in-infrastructure/Explore/components/SearchBar';
import { infraExplorePath } from 'in-infrastructure/navigation/paths';
import getEntities from 'in-infrastructure/subscriptions/getEntities';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import EntityLink from 'in-new-components/EntityLink/EntityLink';
import { warning, error } from 'in-new-components/Message/types';
import Sections from 'in-new-components/workspace/Sections';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Stack from 'in-new-components/layout/Stack';
import useObservable from 'in-hooks/useObservable';
import Message from 'in-new-components/Message';
import useUrlState from 'in-hooks/useUrlState';
import Card from 'in-new-components/Card';
import Title from 'in-components/Title';

const urlStateDefinition = {
  bind: [tagFilterExpressionMatrixParameter]
};

export default function InfraExploreView() {
  const timeConfig = useTimeConfig();
  // TODO remove once tag filter expressions are supported by the bacend
  const [tagFilters, setTagFilters] = useState(null);
  const [{ tagFilterExpression }, onChange] = useUrlState(urlStateDefinition);
  const validResult = useObservable(isQueryValid(tagFilterExpression), [tagFilterExpression]) ?? pendingResult;
  const backendQueryModel = toBackendQueryModel(tagFilterExpression);

  return (
    <InfraPageHeaderWithTabs showSearchBar={false} theme={themes.light} addShadow addFooter>
      <Title title="Explore" />
      <LeftRightPadding>
        <Stack>
          <Message type={warning} withIcon small>
            This is a work in progress. The final version of Infra Explore might look nothing like this.
          </Message>

          {/* TODO remove once tag filter expressions are supported by the bacend */}
          <SearchBar onFiltersChanged={filters => setTagFilters(filters)} />

          <Message type={warning} withIcon small>
            The query builder is not yet connected to the backend. Whatever you enter down below will be transmitted to
            the backend, but not yet interpreted.
          </Message>

          <Sections>
            <QueryBuilderSection
              value={tagFilterExpression}
              onChange={tagFilterExpression => onChange({ tagFilterExpression })}
              QueryBuilder={QueryBuilder}
            />
            <ActionSection
              left={
                <>
                  <Action icon="lib_help_error_help_outline">Add grouping</Action>
                  <Action icon="lib_bar_chart">Add chart</Action>
                </>
              }
              right={<ApiQueryAction backendQueryModel={backendQueryModel} />}
            />
          </Sections>

          {validResult.data === false && (
            <Message type={error} withIcon small>
              The filter expression is invalid. Please address the validation failures before continuing.
            </Message>
          )}

          {validResult.data === true && (
            <Card>
              <ServerTableWithUrlState
                get={getTableData}
                timeConfig={timeConfig}
                backendQueryModel={backendQueryModel}
                // TODO remove once tag filter expressions are supported by the backend
                tagFilters={tagFilters}
              />
            </Card>
          )}
        </Stack>
      </LeftRightPadding>
    </InfraPageHeaderWithTabs>
  );
}

function getTableData({ timeConfig, page, pageSize, tagFilters, backendQueryModel, orderBy, orderDirection }) {
  return getEntities({
    filter: {
      // TODO remove once tag filter expressions are supported by the bacend
      tagFilters: tagFilters ?? [],
      tagFilterExpression: backendQueryModel,
      timeConfig
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    pagination: {
      page,
      pageSize
    }
  });
}

const columnDefinitions = [
  {
    id: 'label',
    label: 'Name',
    getContent(item) {
      return <EntityLink label={item.label} plugin={item.pluginId} href$={getDashboardLink(item.snapshotId)} />;
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions,
  defaultOrderBy: 'label',
  defaultOrderDirection: 'ASC',
  isSearchable: false,
  pathSegment: infraExplorePath,
  matrixPrefix: 'table.'
});
