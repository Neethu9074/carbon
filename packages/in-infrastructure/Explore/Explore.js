import React, { useState } from 'react';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import InfraPageHeaderWithTabs from 'in-infrastructure/components/InfraPageHeaderWithTabs';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { themes } from 'in-new-components/DashboardHeader/DashboardHeader';
import SearchBar from 'in-infrastructure/Explore/components/SearchBar';
import { infraExplorePath } from 'in-infrastructure/navigation/paths';
import getEntities from 'in-infrastructure/subscriptions/getEntities';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import EntityLink from 'in-new-components/EntityLink/EntityLink';
import { warning } from 'in-new-components/Message/types';
import { timeConfig$ } from 'in-stores/time/config';
import Stack from 'in-new-components/layout/Stack';
import Message from 'in-new-components/Message';
import Card from 'in-new-components/Card';

import Title from 'in-components/Title';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    timeConfig: timeConfig$
  },
  function InfraExploreView({ timeConfig }) {
    let [tagFilters, setTagFilters] = useState(null);
    return (
      <InfraPageHeaderWithTabs showSearchBar={false} theme={themes.light} addShadow addFooter>
        <Title title="Explore" />
        <LeftRightPadding>
          <Stack>
            <Message type={warning} withIcon small>
              This is a work in progress. The final version of Infra Explore might look nothing like this.
            </Message>

            <SearchBar onFiltersChanged={filters => setTagFilters(filters)} />

            <Card>
              <ServerTableWithUrlState get={getTableData} timeConfig={timeConfig} tagFilters={tagFilters} />
            </Card>
          </Stack>
        </LeftRightPadding>
      </InfraPageHeaderWithTabs>
    );
  }
);

function getTableData({ timeConfig, page, pageSize, tagFilters, orderBy, orderDirection }) {
  if (tagFilters) {
    return getEntities({
      filter: { tagFilters, timeConfig },
      order: { by: orderBy, direction: orderDirection },
      pagination: { page, pageSize }
    });
  }
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
