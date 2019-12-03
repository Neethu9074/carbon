import { find } from 'lodash';
import React from 'react';

import CheckboxBarOverlay from 'in-analyze/components/filterBar/CheckboxBarOverlay/CheckboxBarOverlay';

export default function CheckboxBarItemBehavior({ tagFilters, tag, removeTagFilter, upsertTagFilter }) {
  const existingSyntheticFilter = find(
    tagFilters,
    f => f.name === tag.synthetic && f.operator === 'EQUALS' && f.value === 'true'
  );
  const existingInternalFilter = find(
    tagFilters,
    f => f.name === tag.internal && f.operator === 'EQUALS' && f.value === 'true'
  );

  return (
    <CheckboxBarOverlay
      existingSyntheticFilter={existingSyntheticFilter}
      existingInternalFilter={existingInternalFilter}
      tag={tag}
      onChangeSynthetic={newItem => {
        if (!existingSyntheticFilter) {
          upsertTagFilter({
            name: newItem,
            stringValue: 'true',
            operator: 'EQUALS',
            entity: 'DESTINATION'
          });
        } else if (newItem === existingSyntheticFilter.name) {
          removeTagFilter(newItem, 'EQUALS');
        }
      }}
      onChangeHidden={newItem => {
        if (!existingInternalFilter) {
          upsertTagFilter({
            name: newItem,
            stringValue: 'true',
            operator: 'EQUALS',
            entity: 'DESTINATION'
          });
        } else if (newItem === existingInternalFilter.name) {
          removeTagFilter(newItem, 'EQUALS');
        }
      }}
    />
  );
}
