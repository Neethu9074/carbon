import React from 'react';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import getWebsites from 'in-subscription/websiteMonitoring/getWebsites';
import { websitesPath } from 'in-websites/navigation/paths';
import ListTitle from 'in-new-components/lists/Title';
import { timeConfig$ } from 'in-stores/time/config';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import { role } from 'in-stores/user';

const rightHeader = role.canConfigureWebsites && (
  <Button kind="action" icon="lib_openclose_add_circle_outline">
    Add Website
  </Button>
);

export default connectTo(
  {
    timeConfig: timeConfig$,
    totalNumberOfWebsites: timeConfig$
      .flatMap(timeConfig =>
        getWebsites({
          timeConfig,
          pagination: {
            page: 1,
            pageSize: 1
          },
          order: {
            by: 'websiteLabel',
            direction: 'ASC'
          },
          metrics: {}
        })
      )
      .map(result => {
        if (result.data == null) {
          return null;
        }
        return result.data.totalHits;
      })
  },
  function WebsitesList({ timeConfig }) {
    const leftHeader = <ListTitle>Websites</ListTitle>;

    return (
      <MaxWidthFullscreenContainer>
        <Title title="Websites" />

        <ServerTableWithUrlBoundState
          get={getTableData}
          pathSegment={websitesPath}
          matrixPrefix=""
          columnDefinitions={columnDefinitions}
          timeConfig={timeConfig}
          rightHeader={rightHeader}
          leftHeader={leftHeader}
          paginationResettingProps={{ timeConfig }}
          defaultOrderBy="websiteLabel"
          defaultOrderDirection="ASC"
        />
      </MaxWidthFullscreenContainer>
    );
  }
);

function getTableData({ query, page, pageSize, orderBy, orderDirection, timeConfig }) {
  return getWebsites({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    metrics: {},
    labelFilter: query,
    timeConfig
  });
}

const columnDefinitions = [
  {
    id: 'websiteLabel',
    label: 'Name',
    getContent(item) {
      return item.website.label;
    }
  }
];
