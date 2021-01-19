/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { getBooleanTagFilters } from 'in-analyze/components/filterBar/BooleanBarItem/util';
import BarItem from 'in-analyze/components/filterBar/BarItem/BarItem';

export default function BooleanBarItem(props) {
  const { singularLabel, refSetter, removeTagFilter, tag, upsertTagFilter } = props;
  const { isTrue } = getBooleanTagFilters(props);

  const toggleFilter = () => {
    if (isTrue) {
      removeTagFilter(tag, 'EQUALS');
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
