import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import { operators } from 'in-analyze/applicationFilter';
import { getTagFromList } from 'in-applications/tags';
import SvgIcon from 'in-components/SvgIcon';

import locals from './List.mless';

export default function List({ items, tagName, onValueClick, filters, renderIcon = renderIconDefault }) {
  return (
    <ul className={locals.suggestionList}>
      {items.map(suggestion => {
        const tagFilter = filters.get('tagFilter').toJS();
        const containsItem = getTagFromList(tagFilter, {
          name: tagName,
          value: suggestion.value,
          operator: operators.EQUALS
        });

        return (
          <li
            key={suggestion.value}
            className={evaluateClassNames({
              [locals.suggestion]: true,
              [locals.containsItem]: containsItem
            })}
            onClick={() => (containsItem ? {} : onValueClick(suggestion.value))}
          >
            {renderIcon(suggestion)}
            <span className={locals.itemText}>{suggestion.label}</span>
            {containsItem && <SvgIcon className={locals.containsItemIcon} type="lib_uncheck" width={24} height={24} />}
          </li>
        );
      })}
    </ul>
  );
}

function renderIconDefault(item) {
  if (!item.icon) {
    return null;
  }
  return <SvgIcon className={locals.entityIcon} type={item.icon} width={24} height={24} />;
}
