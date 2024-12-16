/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { SvgIcon, Pagination as CarbonPagination, SearchInput, Button } from '@instana/components';

import convertToScopes from 'in-components/time/TimeSelectionDialogPresenter/convertToScopes';
import ReleaseScope from 'in-components/time/TimeSelectionDialogPresenter/ReleaseScope';
import { getReleasesWithDefaults } from 'in-events/subscriptions/getReleases';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { carbonPaginationEnabled } from 'in-services/featureFlags';
import { formatDateTime } from 'in-services/formatters/date';
import ServerTable from 'in-components/tables/ServerTable';
import Pagination from 'in-components/Pagination';
import { days } from 'in-services/time';
import { t } from 'in-i18n';

import locals from './Releases.mless';

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-components:time.releasesLabelName'),
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
    label: t('in-components:time.releasesLabelScope'),
    sortable: false,
    getContent: function ColumnContent(item) {
      const stepSize = 2;
      const itemScopes = convertToScopes(item);
      const [showItems, setShowItems] = useState(itemScopes.length > stepSize ? stepSize : itemScopes.length);

      if (!item.services && !item.applications) {
        return <span>{t('in-components:time.releasesLabelGlobal')}</span>;
      }

      const scopes = itemScopes.map((scope, i) => (
        <ReleaseScope
          key={i}
          serviceId={scope.serviceId}
          serviceName={scope.serviceName}
          applicationId={scope.applicationId}
          applicationName={scope.applicationName}
        />
      ));
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
                {t('in-components:time.releasesLabelShowMore', {
                  stepSize: Math.min(stepSize, scopes.length - showItems)
                })}
              </Button>
            </span>
          )}
        </>
      );
    }
  },
  {
    id: 'start',
    label: t('in-components:time.releasesLabelReleaseTime'),
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
          getReleasesWithDefaults({
            timeConfig: releaseTimeConfig,
            page,
            pageSize,
            query,
            orderBy,
            orderDirection
          })
        }
        getResettingProps={() => ['query']}
        defaultPageSize={5}
        defaultPageSizes={[5]}
        columnDefinitions={columnDefinitions}
        getRowProps={() => ({ size: 'compact' })}
        onRowClick={({ start }) => {
          const to = start + timeConfig.windowSize / 2;
          onChange({ windowSize: timeConfig.windowSize, to });
          closeOverlay();
        }}
        noDataMessage={t('in-components:time.releasesLabelNoDataMessage')}
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
      placeholder={t('in-components:time.releasesLabelPlaceholderFilter')}
      onChange={query => onChange({ query, orderBy, orderDirection, page: 1, pageSize })}
    />
  );
}

function renderPagination({
  page,
  totalItems,
  numPages,
  onChange,
  query,
  orderBy,
  orderDirection,
  pageSize,
  pageSizes
}) {
  return carbonPaginationEnabled && totalItems > 0 ? (
    <CarbonPagination
      currentPage={page}
      totalItems={totalItems}
      pageSize={pageSize}
      pageSizes={pageSizes ?? [pageSize]}
      onChange={data => {
        return onChange({ query, orderBy, orderDirection, page: data.page, pageSize, pageSizes });
      }}
    />
  ) : (
    <Pagination
      currentPage={page}
      numPages={numPages}
      onChange={page => onChange({ query, orderBy, orderDirection, page, pageSize })}
    />
  );
}
