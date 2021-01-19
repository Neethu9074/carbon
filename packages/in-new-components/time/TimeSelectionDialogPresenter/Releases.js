/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';

import convertToScopes from 'in-new-components/time/TimeSelectionDialogPresenter/convertToScopes';
import ReleaseScope from 'in-new-components/time/TimeSelectionDialogPresenter/ReleaseScope';
import { getReleasesWithDefaults } from 'in-events/subscriptions/getReleases';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { formatDateTime } from 'in-services/formatters/date';
import ServerTable from 'in-components/tables/ServerTable';
import SearchInput from 'in-new-components/SearchInput';
import Pagination from 'in-new-components/Pagination';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import { days } from 'in-services/time';

import locals from './Releases.mless';

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    getContent({ name }) {
      return (
        <div className={locals.iconAndType}>
          <SvgIcon type="lib_release_rocket" size="s" />
          {name}
        </div>
      );
    }
  },
  {
    id: 'scope',
    label: 'Scope',
    sortable: false,
    getContent(item) {
      if (!item.services && !item.applications) {
        return <span>Global</span>;
      }
      const itemScopes = convertToScopes(item);
      const scopes = itemScopes.map((scope, i) => (
        <ReleaseScope
          key={i}
          serviceId={scope.serviceId}
          serviceName={scope.serviceName}
          applicationId={scope.applicationId}
          applicationName={scope.applicationName}
        />
      ));
      const stepSize = 2;
      const [showItems, setShowItems] = useState(scopes.length > stepSize ? stepSize : scopes.length);
      let scopesShown = scopes.slice(0, showItems);
      return (
        <>
          {scopesShown}
          {showItems < scopes.length && (
            <span>
              <Button
                className={locals.moreButton}
                kind="action"
                onClick={e => {
                  stopPropagationAndPreventDefault(e);
                  setShowItems(showItems + stepSize);
                }}
              >
                … show {Math.min(stepSize, scopes.length - showItems)} more
              </Button>
            </span>
          )}
        </>
      );
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
