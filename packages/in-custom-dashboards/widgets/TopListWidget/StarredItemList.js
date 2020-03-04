import React, { useState } from 'react';

import { LoadingListItem, ErrorListItem } from 'in-custom-dashboards/widgets/TopListWidget/ItemList';
import { hasError, isLoading } from 'in-services/util/result';
import { joinClassNames } from 'in-services/util/classnames';
import { Ul, Li } from 'in-new-components/lists/List';
import connectTo from 'in-hoc/connectTo';

import locals from './StarredItemList.mless';
import listLocals from './ItemList.mless';

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
    <Ul className={joinClassNames(listLocals.list, locals.list)}>
      {items.sort((a, b) => resolvedMetrics.get(b.id) - resolvedMetrics.get(a.id)).map(({ id, type }) => (
        <Item
          key={id}
          id={id}
          type={type}
          getItem={getItem}
          setResolvedItem={setResolvedItem}
          timeConfig={timeConfig}
          columnDefinitions={columnDefinitions}
        />
      ))}
    </Ul>
  );
}

const Item = connectTo(
  ({ id, type, timeConfig, getItem, setResolvedItem }) => ({
    result: getItem(id, timeConfig, type).tap(item => setResolvedItem(id, item))
  }),

  function Item({ result, timeConfig, columnDefinitions }) {
    if (!result || isLoading(result)) {
      return <LoadingListItem />;
    }
    if (hasError(result)) {
      return <ErrorListItem errors={result.errors} />;
    }

    return (
      <Li className={listLocals.listItem}>
        {columnDefinitions.map(({ column, getContent }, i) => (
          <div key={i} style={{ gridColumn: column }} className={listLocals.column}>
            {getContent(result.data ? result.data : result, { result, timeConfig })}
          </div>
        ))}
      </Li>
    );
  }
);
