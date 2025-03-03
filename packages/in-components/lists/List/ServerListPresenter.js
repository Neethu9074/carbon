/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Pagination as CarbonPagination } from '@instana/components';
import { ColumnizedContent, Ul, Li } from '@instana/components';

/*
  This can be used as a Renderer for the ServerTableWithUrlState data handler
*/
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import ErrorList from 'in-components/lists/List/sharedComponents/ErrorList';
import ApiListHeader from 'in-settings/components/ApiList/ApiListHeader';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';

export default function ServerListPresenter(props) {
  const {
    // values configurable via the table
    query,
    page,
    orderBy,
    orderDirection,
    pageSize,

    // values that define the content
    columnDefinitions,
    result = pendingResult,
    numSkeletonRows = 3,
    noDataMessage,
    renderNoDataAvailable,

    // events
    onChange,
    getItemLink,
    onClick
  } = props;

  let content;
  if (isLoading(result)) {
    // body = getLoadingContent(filteredAndDisabledColumnDefinitions, numSkeletonRows, result);
    content = <LoadingList numSkeletonRows={numSkeletonRows} />;
  } else if (hasError(result)) {
    content = <ErrorList errors={result.errors} />;
  } else if (result.data.items.length === 0) {
    content = getEmptyContent(renderNoDataAvailable, noDataMessage);
  } else {
    content = (
      <>
        <Ul>
          {result.data.items.map((item, rowIndex) => (
            <Li
              key={rowIndex}
              href$={getItemLink ? getItemLink(item) : undefined}
              onClick={onClick ? () => onClick(item) : undefined}
            >
              <ColumnizedContent {...props} item={item} columnDefinitions={columnDefinitions} result={result} />
            </Li>
          ))}
        </Ul>
        {result.data.totalHits > result.data.pageSize && (
          <CarbonPagination
            currentPage={page}
            totalItems={result.data.totalHits}
            pageSize={result.data.pageSize}
            pageSizes={[result.data.pageSize]}
            onChange={data => {
              onChange({ query, orderBy, orderDirection, page: data.page, pageSize });
            }}
          />
        )}
      </>
    );
  }

  return (
    <>
      <ApiListHeader
        totalItems={result.data?.items?.length}
        totalFilteredItems={result.data?.items?.length}
        searchFields={[]}
        query={query}
        setQuery={_query => onChange({ query: _query })}
      />
      {content}
    </>
  );
}

function getEmptyContent(renderNoDataAvailable, noDataMessage) {
  return (
    <Ul>
      <Li>
        {renderNoDataAvailable ? (
          renderNoDataAvailable(noDataMessage)
        ) : (
          <NoDataAvailable text={noDataMessage} height={80} />
        )}
      </Li>
    </Ul>
  );
}
