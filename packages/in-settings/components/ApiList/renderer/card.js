/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Card } from '@instana/components';
import React from 'react';

import LoadingList from 'in-new-components/lists/List/sharedComponents/LoadingList';
import ResolveResult from 'in-settings/components/ApiList/renderer/ResolveResult';
import EmptyList from 'in-new-components/lists/List/sharedComponents/EmptyList';
import ErrorList from 'in-new-components/lists/List/sharedComponents/ErrorList';
import TemporaryMessage from 'in-new-components/TemporaryMessage';
import SearchInput from 'in-new-components/SearchInput';
import Pagination from 'in-new-components/Pagination';
import { t } from 'in-i18n';

import locals from '../ApiListHeader.mless';

export default function renderListInsideCard(props) {
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
          totalFilteredItems,
          pageItems,
          itemName,
          isLoading
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
          <Card
            title={
              t('in-settings:components.' + itemName, { count: totalFilteredItems }) +
              `${totalFilteredItems > 0 ? '(' + totalFilteredItems + ')' : ''}`
            }
            header={<Header {..._props} />}
            bodyWithoutPadding
          >
            {message && <TemporaryMessage {...message} duration={retainMessagesAfter} />}
            {content}
            <Pagination currentPage={page} numPages={numPages} onChange={setPage} />
          </Card>
        );
      }}
    </ResolveResult>
  );
}

function LoadingApiList(props) {
  return (
    <Card
      title={t('in-settings:components.' + props.itemName, { count: props.totalFilteredItems })}
      bodyWithoutPadding
      headerClassName={locals.cardHeader}
    >
      <LoadingList />
    </Card>
  );
}

function Header(props) {
  const { renderAdditionalHeaderContent, searchFields, totalItems, searchPlaceholder, query, setQuery } = props;

  return (
    <header className={locals.header}>
      {renderAdditionalHeaderContent && renderAdditionalHeaderContent(props)}
      {searchFields && totalItems > 0 && (
        <SearchInput
          className={locals.searchInput}
          maxWidth={200}
          placeholder={searchPlaceholder || t('in-settings:components.search')}
          query={query}
          onChange={setQuery}
        />
      )}
    </header>
  );
}
