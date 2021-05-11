/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { ColumnizedContent, Ul, Li } from '@instana/components';

/*
  This can be used as a Renderer for the ServerTableWithUrlState data handler
*/
import LoadingList from 'in-new-components/lists/List/sharedComponents/LoadingList';
import ErrorList from 'in-new-components/lists/List/sharedComponents/ErrorList';
import ApiListHeader from 'in-settings/components/ApiList/ApiListHeader';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import Pagination from 'in-new-components/Pagination';

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
    // body = <ErrorRows cols={filteredAndDisabledColumnDefinitions.length} errors={result.errors} size={size} />;
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
          <div>
            <Pagination
              currentPage={page}
              numPages={Math.ceil(result.data.totalHits / result.data.pageSize)}
              onChange={page => onChange({ query, orderBy, orderDirection, page, pageSize })}
            />
          </div>
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
