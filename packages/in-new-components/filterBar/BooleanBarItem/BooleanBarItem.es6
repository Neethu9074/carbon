import React from 'react';

import { getBooleanTagFilters } from 'in-new-components/filterBar/BooleanBarItem/util';
import BarItem from 'in-new-components/filterBar/BarItem/BarItem';

export default function BooleanBarItem(props) {
  const { singularLabel, refSetter, removeTagFilter, tag, upsertTagFilter } = props;
  const { isTrue } = getBooleanTagFilters(props);

  const toggleFilter = () => {
    if (isTrue) {
      removeTagFilter(tag);
    } else {
      upsertTagFilter({
        name: tag,
        operator: 'EQUALS',
        value: 'true'
      });
    }
  };

  return (
    <BarItem isOpen={false} active={isTrue} onClick={toggleFilter} refSetter={refSetter}>
      {singularLabel}
    </BarItem>
  );
}
