/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';

export default function TagFilterList(props) {
  const { tagFilters, setTagFilters, trackFilterRemoved } = props;

  const onRemoveTagFilter = tagFilter => {
    setTagFilters(tagFilters.filter(f => f !== tagFilter));

    if (trackFilterRemoved) {
      const before = tagFilters.filter(f => f === tagFilter);
      if (before.length > 0) {
        trackFilterRemoved({ name: tagFilter.name, filter: before[0] });
      } else {
        trackFilterRemoved({ name: tagFilter.name });
      }
    }
  };

  return <TagFilterListPresenter {...props} onRemoveTagFilter={onRemoveTagFilter} />;
}
