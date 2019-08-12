import React from 'react';

import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import WithEmptyStateFallback from 'in-new-components/WithEmptyStateFallback';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import getReleases from 'in-events/subscriptions/getReleases';
import { close } from 'in-components/DialogPresenter/store';
import { formatDateTime } from 'in-services/formatters/date';
import { getModifiedUrlStream } from 'in-stores/navigation';
import ServerTable from 'in-components/tables/ServerTable';
import { setTimeConfig } from 'in-stores/time/config';
import Link from 'in-components/Link';

function getColumnDefinitions({ windowSize }) {
  return [
    {
      id: 'name',
      label: 'Release',
      getContent(entity) {
        return (
          <Link
            onClick={() => close()}
            href$={getModifiedUrlStream(params => {
              const to = entity.start + windowSize / 2;
              setTimeConfig(params, { to, windowSize });
            })}
          >
            {entity.name}
          </Link>
        );
      },
      getValue(entity) {
        return entity.name;
      }
    },
    {
      id: 'start',
      label: 'Started',
      defaultOrderDirection: 'DESC',
      getContent(entity) {
        return formatDateTime(entity.start);
      }
    }
  ];
}

export default function TimePresetsForReleases({ timeConfig }) {
  const columnDefinitions = getColumnDefinitions(timeConfig);
  return (
    <WithEmptyStateFallback
      center={false}
      getHasDataToRender={getHasDataToRender}
      FallbackComponent={() => (
        <ServerTablePresenter
          columnDefinitions={columnDefinitions}
          pageSize={5}
          query=""
          page={1}
          result={{ errors: [], progress: { loading: false }, data: { items: [] } }}
          renderNoDataAvailable={() => NoDataAvailable}
        />
      )}
    >
      <ServerTable
        get={getReleasesSubscribeEvent}
        getResettingProps={() => ['query']}
        defaultPageSize={5}
        columnDefinitions={columnDefinitions}
        paginationResettingProps={{}}
        getRowProps={() => ({ size: 'compact' })}
        noDataMessage="No releases found"
        defaultOrderBy="start"
        defaultOrderDirection="DESC"
        searchPlaceholder="Filter…"
      />
    </WithEmptyStateFallback>
  );
}

function getHasDataToRender() {
  return getReleasesSubscribeEvent({}).map(result => !result.data || result.data.totalHits > 0);
}

export function getReleasesSubscribeEvent({
  page = 1,
  pageSize = 5,
  orderBy = 'start',
  orderDirection = 'DESC',
  query = '',
  timeConfig = null
}) {
  return getReleases({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: query,
    timeConfig: timeConfig
  });
}
