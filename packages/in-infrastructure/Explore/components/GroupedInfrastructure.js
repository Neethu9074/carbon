import React from 'react';

import { ColumnizedContent, Ul, Li, LoadingSkeletonLi, HorizontalIndicatorLi } from 'in-new-components/lists/List';
import InfrastructureList from 'in-infrastructure/Explore/components/InfrastructureList';
import { getUniqueErrors } from 'in-new-components/Errors/ErroneousResultPresenter';
import createGetGroupsSubscription from 'in-infrastructure/subscriptions/getGroups';
import LoadMoreLi from 'in-new-components/lists/List/LoadMoreLi/LoadMoreLi';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { error as errorType } from 'in-new-components/Message/types';
import { indeterminateProgress } from 'in-services/fixedObjects';
import IconButton from 'in-new-components/IconButton/IconButton';
import useCursorPagination from 'in-hooks/useCursorPagination';
import KeyValue from 'in-new-components/lists/KeyValue';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Message from 'in-new-components/Message';

import locals from './GroupedInfrastructure.mless';

export default function GroupedInfrastructure({ tagFilterExpression, groupBy }) {
  const timeConfig = useTimeConfig();

  const props = useCursorPagination(({ cursor }) => getGroups({ timeConfig, tagFilterExpression, groupBy, cursor }), [
    timeConfig,
    tagFilterExpression,
    groupBy
  ]);

  return <Presenter timeConfig={timeConfig} tagFilterExpression={tagFilterExpression} groupBy={groupBy} {...props} />;
}

function Presenter({
  progress,
  errors,
  canLoadMore,
  loadMore,
  totalHits,
  items,
  timeConfig,
  tagFilterExpression,
  groupBy
}) {
  const hasErrors = errors?.length > 0;
  const isLoading = progress?.loading;
  const columnDefinitions = columns(groupBy);

  return (
    <>
      {totalHits > 0 && <HeaderRow totalGroups={totalHits} />}
      <Ul space="xsmall">
        {items.map((item, rowIndex) => (
          <Li
            key={rowIndex}
            noAlternatingBg
            borderRadius="medium"
            toggleContentOnRowClick
            highlightOpenState={false}
            renderNestedContent={() => (
              <ExpandedGroup group={item} tagFilterExpression={tagFilterExpression} timeConfig={timeConfig} />
            )}
          >
            <ColumnizedContent columnDefinitions={columnDefinitions} group={item} />
          </Li>
        ))}
        {isLoading && <HorizontalIndicatorLi progress={indeterminateProgress} />}
        {isLoading && <LoadingSkeletonLi />}
        {hasErrors &&
          getUniqueErrors(errors).map(error => (
            <Li key={error}>
              <Message className={locals.message} type={errorType} small>
                {error}
              </Message>
            </Li>
          ))}
        {canLoadMore && <LoadMoreLi loadMore={loadMore} />}
      </Ul>
      {!isLoading && items.length === 0 && <NoDataAvailable height={240} />}
    </>
  );
}

function columns(groupBy) {
  return [
    {
      width: '3rem',
      getContent() {
        return <IconButton key="someKey1" type="lib_views_tag" />;
      }
    }
  ]
    .concat(
      groupBy.map((groupKey, i) => ({
        width: getColumnWidth(groupBy, i),
        getContent({ group }) {
          const value = group.tags[groupKey];
          return <KeyValue label={groupKey} value={value} accentuated />;
        }
      }))
    )
    .concat([
      {
        width: '6rem',
        getContent({ group }) {
          return <KeyValue label="Count" value={group.count} theme="blue" accentuated />;
        }
      },
      {
        width: '3rem',
        getContent() {
          return <IconButton key="someKey" type="lib_menu_more_horizontal" />;
        }
      }
    ]);
}

function getColumnWidth(groupBy, index) {
  if (index !== groupBy.length - 1) {
    return 50 / groupBy.length + 'rem';
  }
}

function getGroups({ timeConfig, tagFilterExpression, groupBy, cursor }) {
  return createGetGroupsSubscription({
    filter: {
      timeConfig,
      tagFilterExpression
    },
    pagination: {
      cursor,
      retrievalSize: 20
    },
    groupBy
  });
}

function HeaderRow({ totalGroups }) {
  return <h3 className={locals.header}>{totalGroups} Groups</h3>;
}

function ExpandedGroup({ group, tagFilterExpression, timeConfig }) {
  return (
    <InfrastructureList
      tagFilterExpression={addTagFilters(tagFilterExpression, group.tags)}
      timeConfig={timeConfig}
      retrievalSize={5}
      numSkeletonRows={Math.min(group.count, 5)}
    />
  );
}

function addTagFilters(tagFilterExpression, tags) {
  const tagFilters = Object.entries(tags).map(([key, value]) => ({
    type: 'TAG_FILTER',
    operator: 'EQUALS',
    name: key,
    value
  }));
  if (!tagFilterExpression && tagFilters.length == 1) {
    return tagFilters[0];
  }
  return {
    type: 'EXPRESSION',
    logicalOperator: 'AND',
    elements: [tagFilterExpression, ...tagFilters].filter(Boolean)
  };
}
