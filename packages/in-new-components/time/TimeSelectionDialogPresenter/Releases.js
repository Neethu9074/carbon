import React from 'react';

import { getReleasesWithDefaults } from 'in-events/subscriptions/getReleases';
import { formatDateTime } from 'in-services/formatters/date';
import ServerTable from 'in-components/tables/ServerTable';
import SearchInput from 'in-new-components/SearchInput';
import Pagination from 'in-new-components/Pagination';
import { days } from 'in-services/time';

import locals from './Releases.mless';

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    getContent({ name }) {
      return <span>{name}</span>;
    }
  },
  {
    id: 'start',
    label: 'Release time',
    getContent({ start }) {
      return <span>{formatDateTime(start)}</span>;
    }
  }
];
export default function Presets({ timeConfig, onChange, closeOverlay }) {
  const releaseTimeConfig = {
    to: null,
    focusedMoment: null,
    autoRefresh: timeConfig.autoRefresh,
    windowSize: days.toMillis(30)
  };

  return (
    <div className={locals.wrapper}>
      <ServerTable
        get={({ page, pageSize, query, orderBy, orderDirection }) =>
          getReleasesWithDefaults({ timeConfig: releaseTimeConfig, page, pageSize, query, orderBy, orderDirection })
        }
        getResettingProps={() => ['query']}
        defaultPageSize={5}
        columnDefinitions={columnDefinitions}
        getRowProps={() => ({ size: 'compact' })}
        onRowClick={({ start }) => {
          const to = start + timeConfig.windowSize / 2;
          onChange({ windowSize: timeConfig.windowSize, to });
          closeOverlay();
        }}
        noDataMessage="No releases found"
        defaultOrderBy="start"
        defaultOrderDirection="DESC"
        rightHeader={RightHeader}
        renderPagination={renderPagination}
        isSearchable={false}
      />
    </div>
  );
}

function RightHeader({ query, onChange, orderBy, orderDirection, pageSize }) {
  return (
    <SearchInput
      className={locals.searchInput}
      query={query}
      placeholder="Filter..."
      onChange={query => onChange({ query, orderBy, orderDirection, page: 1, pageSize })}
    />
  );
}

function renderPagination({ page, numPages, onChange, query, orderBy, orderDirection, pageSize }) {
  return (
    <Pagination
      currentPage={page}
      numPages={numPages}
      onChange={page => onChange({ query, orderBy, orderDirection, page, pageSize })}
    />
  );
}
