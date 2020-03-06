import React, { useState } from 'react';

import { ErrorListItem, LoadingListItem, Cell } from 'in-custom-dashboards/widgets/TopListWidget/ItemList';
import { hasError, isLoading } from 'in-services/util/result';
import { Ul, Li } from 'in-new-components/lists/List';
import connectTo from 'in-hoc/connectTo';

import locals from './ItemList.mless';

export default function StarredItemList({ getItem, timeConfig, columnDefinitions, getItemLink, pinnedItemIdsByType }) {
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
    <Ul className={locals.list}>
      {items.sort((a, b) => resolvedMetrics.get(b.id) - resolvedMetrics.get(a.id)).map((item, rowIndex) => (
        <Item
          key={rowIndex}
          id={item.id}
          type={item.type}
          getItem={getItem}
          timeConfig={timeConfig}
          getItemLink={getItemLink}
          setResolvedItem={setResolvedItem}
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

  function Item(props) {
    const { result, timeConfig, columnDefinitions, getItemLink } = props;

    if (!result || isLoading(result)) {
      return <LoadingListItem />;
    }
    if (hasError(result)) {
      return <ErrorListItem errors={result.errors} />;
    }

    const item = result.data ? result.data : result;

    return (
      <Li className={locals.listItem} href$={getItemLink(item)}>
        {columnDefinitions.map(({ width, ellipsis, getContent }, i) => (
          <Cell key={i} width={width} ellipsis={ellipsis}>
            {getContent(item, { result, timeConfig })}
          </Cell>
        ))}
      </Li>
    );
  }
);
