/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { ColumnizedContent, Ul, Li } from '@instana/components';
import { LoadingSkeleton } from '@instana/components';

import { getUniqueErrors } from 'in-new-components/Errors/ErroneousResultPresenter';
import WithStarredItems from 'in-cockpit/widgets/TopListWidget/WithStarredItems';
import { hasError, isLoading } from 'in-services/util/result';
import { error } from 'in-new-components/Message/types';
import Message from 'in-new-components/Message';

import locals from './ItemList.mless';

export default function StarredItemList({ getItem, timeConfig, columnDefinitions, getItemLink, pinnedItemIdsByType }) {
  return (
    <WithStarredItems
      pinnedItemIdsByType={pinnedItemIdsByType}
      getItem={getItem}
      timeConfig={timeConfig}
      render={items =>
        items && items.length > 0 ? (
          <Ul className={locals.list}>
            {items.sort(sort).map(item => (
              <Item
                key={item.id}
                item={item}
                timeConfig={timeConfig}
                getItemLink={getItemLink}
                columnDefinitions={columnDefinitions}
              />
            ))}
          </Ul>
        ) : null
      }
    />
  );
}

function sort(i1, i2) {
  const mainKpiValue1 = i1?.result?.mainKpiValue || 0;
  const mainKpiValue2 = i2?.result?.mainKpiValue || 0;

  return mainKpiValue2 - mainKpiValue1;
}

function Item({ item, timeConfig, getItemLink, columnDefinitions }) {
  const { id, type, result } = item;

  if (!result || isLoading(result)) {
    return (
      <Li>
        <ColumnizedContent
          columnDefinitions={[
            {
              getContent() {
                return <LoadingSkeleton className={locals.skeleton} />;
              }
            },
            columnDefinitions[columnDefinitions.length - 1]
          ]}
          id={id}
          type={type}
        />
      </Li>
    );
  }
  if (hasError(result)) {
    return (
      <Li>
        <ColumnizedContent
          columnDefinitions={[
            {
              getContent() {
                return (
                  <Message type={error} small>
                    {getUniqueErrors(result.errors)[0]}
                  </Message>
                );
              }
            },
            columnDefinitions[columnDefinitions.length - 1]
          ]}
          id={id}
          type={type}
        />
      </Li>
    );
  }

  const resolvedItem = result.data ? result.data : result;

  return (
    <Li href$={getItemLink(resolvedItem)}>
      <ColumnizedContent
        columnDefinitions={columnDefinitions}
        id={id}
        type={type}
        result={result}
        item={resolvedItem}
        timeConfig={timeConfig}
      />
    </Li>
  );
}
