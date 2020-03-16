import { get } from 'lodash';
import React from 'react';

import { getUniqueErrors, Error } from 'in-new-components/Errors/ErroneousResultPresenter';
import WithStarredItems from 'in-custom-dashboards/widgets/TopListWidget/WithStarredItems';
import { Cell } from 'in-custom-dashboards/widgets/TopListWidget/ItemList';
import { hasError, isLoading } from 'in-services/util/result';
import Skeleton from 'in-new-components/Loading/Skeleton';
import { Ul, Li } from 'in-new-components/lists/List';

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
  const mainKpiValue1 = get(i1, ['result', 'mainKpiValue'], 0);
  const mainKpiValue2 = get(i2, ['result', 'mainKpiValue'], 0);

  return mainKpiValue2 - mainKpiValue1;
}

function Item({ item, timeConfig, getItemLink, columnDefinitions }) {
  const { id, type, result } = item;

  if (!result || isLoading(result)) {
    const starColumn = columnDefinitions[columnDefinitions.length - 1];
    return (
      <Li>
        <Cell>
          <Skeleton className={locals.skeleton} />
        </Cell>
        <Cell width="1rem" />
        <Cell width={starColumn.width}>{starColumn.getContent(item, { id, type })}</Cell>
      </Li>
    );
  }
  if (hasError(result)) {
    const starColumn = columnDefinitions[columnDefinitions.length - 1];
    const error = getUniqueErrors(result.errors)[0];
    return (
      <Li>
        <Cell>
          <Error>{error}</Error>
        </Cell>
        <Cell width="1rem" />
        <Cell width={starColumn.width}>{starColumn.getContent(item, { id, type })}</Cell>
      </Li>
    );
  }

  const resolvedItem = result.data ? result.data : result;

  return (
    <Li className={locals.listItem} href$={getItemLink(resolvedItem)}>
      {columnDefinitions.map(({ width, ellipsis, getContent }, i) => (
        <Cell key={i} width={width} ellipsis={ellipsis}>
          {getContent(resolvedItem, { id, type, result, timeConfig })}
        </Cell>
      ))}
    </Li>
  );
}
