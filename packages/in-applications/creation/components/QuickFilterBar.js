/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import MoreBarItem from 'in-analyze/components/filterBar/MoreBarItem';
import Bar from 'in-analyze/components/filterBar/Bar/Bar';

export default function QuickFilterBar(props) {
  const { curatedTagFilters, onMoreClick } = props;
  return (
    <Bar showClearFilters={false} withoutLabel>
      {curatedTagFilters}
      {onMoreClick && <MoreBarItem {...props} onClick={onMoreClick} />}
    </Bar>
  );
}
