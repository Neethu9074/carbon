import React, { useState } from 'react';

import { getUniqueErrors, Error } from 'in-new-components/Errors/ErroneousResultPresenter';
import { Cell } from 'in-custom-dashboards/widgets/TopListWidget/ItemList';
import { hasError, isLoading } from 'in-services/util/result';
import Skeleton from 'in-new-components/Loading/Skeleton';
import connectTo from 'in-hoc/connectTo';

import locals from './ItemList.mless';

export default function StarredItemList({ getItem, timeConfig, columnDefinitions, pinnedItemIdsByType }) {
  const [resolvedMetrics, setResolvedItems] = useState(new Map());
  const setResolvedItem = (id, item) => {
    const mainKpiValue = (item && item.mainKpiValue) || 0;
    if (resolvedMetrics.get(id) === mainKpiValue) {
      return;
    }
    const newMap = new Map(resolvedMetrics);
    newMap.set(id, mainKpiValue);
    setResolvedItems(newMap);
  };

  const items = [];
  const types = Object.keys(pinnedItemIdsByType);
  for (let i = 0; i < types.length; i++) {
    const type = types[i];
    const ids = pinnedItemIdsByType[type];
    for (let i2 = 0; i2 < ids.length; i2++) {
      const id = ids[i2];
      items.push({ type, id });
    }
  }

  return (
    <div className={locals.grid}>
      {items.sort((a, b) => resolvedMetrics.get(b.id) - resolvedMetrics.get(a.id)).map(({ id, type }, i) => (
        <Item
          key={id}
          id={id}
          type={type}
          getItem={getItem}
          setResolvedItem={setResolvedItem}
          timeConfig={timeConfig}
          columnDefinitions={columnDefinitions}
          inOddRow={i % 2 === 1}
          isLastRow={i === items.length - 1}
        />
      ))}
    </div>
  );
}

const Item = connectTo(
  ({ id, type, timeConfig, getItem, setResolvedItem }) => ({
    result: getItem(id, timeConfig, type).tap(item => setResolvedItem(id, item))
  }),

  function Item({ result, timeConfig, columnDefinitions, inOddRow, isLastRow }) {
    if (!result || isLoading(result)) {
      return (
        <Cell column="1 / span 9">
          <Skeleton className={locals.skeleton} />
        </Cell>
      );
    }
    if (hasError(result)) {
      return (
        <Cell column="1 / span 9">
          <Error>{getUniqueErrors(result.errors)[0]}</Error>
        </Cell>
      );
    }

    return columnDefinitions.map(({ column, ellipsis, getContent }, i) => (
      <Cell
        key={i}
        style={{ gridColumn: column, overflow: ellipsis && 'hidden' }}
        column={column}
        ellipsis={ellipsis}
        firstCellInRow={i === 0}
        inOddRow={inOddRow}
        isLastRow={isLastRow}
      >
        {getContent(result.data ? result.data : result, { result, timeConfig })}
      </Cell>
    ));
  }
);
