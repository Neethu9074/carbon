import React from 'react';

import { ColumnizedContent, Ul, Li, LoadingSkeletonLi, HorizontalIndicatorLi } from 'in-new-components/lists/List';
import InfrastructureList from 'in-infrastructure/Explore/components/InfrastructureList';
import { getUniqueErrors } from 'in-new-components/Errors/ErroneousResultPresenter';
import createGetGroupsSubscription from 'in-infrastructure/subscriptions/getGroups';
import LoadMoreLi from 'in-new-components/lists/List/LoadMoreLi/LoadMoreLi';
import CountHeader from 'in-infrastructure/Explore/components/CountHeader';
import { getOptionalSnapshotDefinition } from 'in-sdk/snapshot/registry';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { error as errorType } from 'in-new-components/Message/types';
import { indeterminateProgress } from 'in-services/fixedObjects';
import IconButton from 'in-new-components/IconButton/IconButton';
import { pluginTag } from 'in-infrastructure/Explore/constants';
import useCursorPagination from 'in-hooks/useCursorPagination';
import KeyValue from 'in-new-components/lists/KeyValue';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Message from 'in-new-components/Message';

import locals from './GroupedInfrastructure.mless';

export default function GroupedInfrastructure({ tagFilterExpression, groupBy, plugin }) {
  const timeConfig = useTimeConfig();

  const props = useCursorPagination(
    ({ cursor }) => getGroups({ timeConfig, tagFilterExpression, groupBy, plugin, cursor }),
    [timeConfig, tagFilterExpression, groupBy, plugin]
  );

  return (
    <Presenter
      timeConfig={timeConfig}
      tagFilterExpression={tagFilterExpression}
      groupBy={[groupBy]}
      plugin={plugin}
      {...props}
    />
  );
}

function Presenter({
  progress,
  errors,
  canLoadMore,
  loadMore,
  totalHits,
  totalRepresentedItemCount,
  items,
  timeConfig,
  tagFilterExpression,
  groupBy,
  plugin
}) {
  const hasErrors = errors?.length > 0;
  const isLoading = progress?.loading;
  const columnDefinitions = columns(groupBy, plugin);

  return (
    <>
      {totalHits > 0 && (
        <CountHeader
          totalHits={totalHits}
          totalRepresentedItemCount={totalRepresentedItemCount}
          hitName="Group"
          itemName="Result"
        />
      )}
      <Ul space="xsmall">
        {items.map((item, rowIndex) => (
          <Li
            key={rowIndex}
            noAlternatingBg
            borderRadius="medium"
            toggleContentOnRowClick
            highlightOpenState={false}
            renderNestedContent={() => (
              <ExpandedGroup
                group={item}
                tagFilterExpression={tagFilterExpression}
                timeConfig={timeConfig}
                plugin={plugin}
              />
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

function columns(groupBy, type) {
  const snapshotDefinition = getOptionalSnapshotDefinition(type);
  const countLabel = snapshotDefinition ? snapshotDefinition.pluginName.plural : 'Count';
  return [
    {
      width: '3rem',
      getContent({ group }) {
        const icon = getGroupIcon(group);
        return <IconButton key="someKey1" type={icon} />;
      }
    }
  ]
    .concat(
      groupBy.map((groupKey, i) => ({
        width: getColumnWidth(groupBy, i),
        getContent({ group }) {
          const value = getGroupTagValue(group, groupKey);
          return <KeyValue label={groupKey} value={value} accentuated />;
        }
      }))
    )
    .concat([
      {
        width: '8rem',
        getContent({ group }) {
          return <KeyValue label={countLabel} value={group.count} theme="blue" accentuated />;
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

function getGroups({ timeConfig, tagFilterExpression, groupBy, cursor, plugin }) {
  return createGetGroupsSubscription({
    filter: {
      timeConfig,
      tagFilterExpression
    },
    pagination: {
      cursor,
      retrievalSize: 20
    },
    groupBy: [groupBy],
    plugin
  });
}

function ExpandedGroup({ group, tagFilterExpression, timeConfig, plugin }) {
  return (
    <InfrastructureList
      tagFilterExpression={addTagFilters(tagFilterExpression, group.tags)}
      timeConfig={timeConfig}
      plugin={plugin}
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

const defaultGroupIcon = 'lib_views_tag';

function getGroupPlugin(group) {
  const plugin = group.tags[pluginTag];
  return plugin ? getOptionalSnapshotDefinition(plugin) : null;
}

function getGroupIcon(group) {
  const plugin = getGroupPlugin(group);
  return plugin ? `plugin:${plugin.plugin}` : defaultGroupIcon;
}

function getGroupTagValue(group, key) {
  if (key === pluginTag) {
    const plugin = getGroupPlugin(group);
    return plugin && plugin.pluginName ? plugin.pluginName.singular : group.tags[key];
  } else {
    return group.tags[key];
  }
}
