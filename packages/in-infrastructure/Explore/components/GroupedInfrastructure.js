import React, { useState } from 'react';

import InfrastructureList from 'in-infrastructure/Explore/components/InfrastructureList';
import createGetGroupsSubscription from 'in-infrastructure/subscriptions/getGroups';
import LoadingList from 'in-new-components/lists/List/sharedComponents/LoadingList';
import ErrorList from 'in-new-components/lists/List/sharedComponents/ErrorList';
import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import IconButton from 'in-new-components/IconButton/IconButton';
import Pagination from 'in-new-components/Pagination/Pagination';
import { hasError, isLoading } from 'in-services/util/result';
import KeyValue from 'in-new-components/lists/KeyValue';
import useObservable from 'in-hooks/useObservable';

import locals from './GroupedInfrastructure.mless';

export default function GroupedInfrastructure({ timeConfig, tagFilterExpression, groupBy }) {
  const [page, setPage] = useState(1);
  const result = useObservable(getGroups({ timeConfig, tagFilterExpression, groupBy, page }), [
    timeConfig,
    tagFilterExpression,
    groupBy,
    page
  ]);

  if (!result || isLoading(result)) {
    return <LoadingList className={locals.list} numSkeletonRows={5} />;
  }
  if (hasError(result)) {
    return <ErrorList className={locals.list} errors={result.errors} />;
  }

  if (result.data.items.length == 0) {
    return <NoDataAvailable height={240} />;
  }

  const columnDefinitions = columns(groupBy);

  return (
    <>
      <HeaderRow totalGroups={result.data.totalHits} />
      <Ul space="xsmall">
        {result.data.items.map((item, rowIndex) => (
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
      </Ul>
      <Footer result={result} setPage={setPage} />
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

function getGroups({ timeConfig, tagFilterExpression, groupBy, page }) {
  return createGetGroupsSubscription({
    filter: {
      timeConfig,
      tagFilterExpression
    },
    pagination: {
      page: page,
      pageSize: 20
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
      pageSize={5}
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

function Footer({ result, setPage }) {
  return (
    result.data &&
    result.data.totalHits > result.data.pageSize && (
      <Pagination
        currentPage={result.data.page}
        numPages={Math.ceil(result.data.totalHits / result.data.pageSize)}
        onChange={setPage}
      />
    )
  );
}
