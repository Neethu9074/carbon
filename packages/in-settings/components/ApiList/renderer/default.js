/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Pagination as CarbonPagination } from '@instana/components';

import ResolveResult from 'in-settings/components/ApiList/renderer/ResolveResult';
import TemporaryMessage from 'in-components/TemporaryMessage/TemporaryMessageV2';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import EmptyList from 'in-components/lists/List/sharedComponents/EmptyList';
import ErrorList from 'in-components/lists/List/sharedComponents/ErrorList';
import ApiListHeader from 'in-settings/components/ApiList/ApiListHeader';

export default function renderDefaultList(props) {
  return (
    <ResolveResult {...props}>
      {_props => {
        const {
          ListRenderer,
          page = 1,
          message,
          setPage,
          numPages,
          retainMessagesAfter = 5000,
          itemsResult,
          hasErrors,
          totalItems,
          totalFilteredItems,
          pageItems,
          isLoading,
          pageSize
        } = _props;
        if (isLoading) {
          return <LoadingApiList {..._props} />;
        }

        let content = <EmptyList />;
        if (hasErrors) {
          content = <ErrorList errors={itemsResult.errors} />;
        } else if (totalFilteredItems > 0) {
          content = <ListRenderer {..._props} items={pageItems} />;
        }
        return (
          <>
            {message && <TemporaryMessage {...message} duration={retainMessagesAfter} />}
            <ApiListHeader {..._props} totalFilteredItems={totalFilteredItems} totalItems={totalItems} />
            {content}
            {numPages > 1 && (
              <CarbonPagination
                currentPage={page}
                totalItems={totalFilteredItems}
                pageSize={pageSize}
                pageSizes={[pageSize]}
                onChange={p => setPage(p.page)}
              />
            )}
          </>
        );
      }}
    </ResolveResult>
  );
}

function LoadingApiList(props) {
  return (
    <>
      <ApiListHeader {...props} isLoading />
      <LoadingList />
    </>
  );
}
