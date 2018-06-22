import React from 'react';

import Badge from 'in-new-components/Badge';
import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './FilterPreview.mless';

export default function FilterPreview({ title, isStatic, items }) {
  const uniqueFilters = getUniqueFilterNames(items);

  return (
    <div className={locals.filterPreview}>
      {title && <span className={locals.title}>{title}</span>}

      <ul className={locals.items}>
        {uniqueFilters.map((config, i) => {
          const style = {};
          if (config.item.color) {
            style.borderLeft = `3px solid ${config.item.color}`;
          }
          return (
            <li
              key={i}
              className={evaluateClassNames({
                [locals.item]: true,
                [locals.static]: isStatic
              })}
              style={style}
            >
              <span>{config.item.label}</span>
              {config.appreance > 1 && (
                <Badge kind="light" className={locals.badge}>
                  {config.appreance}
                </Badge>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function getUniqueFilterNames(items) {
  const filterMap = {};
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!filterMap[item.label]) {
      filterMap[item.label] = {
        appreance: 0
      };
    }
    filterMap[item.label].item = item;
    filterMap[item.label].appreance++;
  }
  return Object.keys(filterMap).map(key => filterMap[key]);
}
