import React from 'react';

import EditTagFilterDialog from 'in-analyze/AnalyzeView/components/AnalyzeEditTagFilterDialog';
import TagFilterList from 'in-analyze/AnalyzeView/components/TagFilterList';
import { setActiveDialog } from 'in-components/DialogPresenter/store';

export default function ProfileTagFilterList(props) {
  return (
    <TagFilterList
      {...props}
      tagFilters={props.tagFilters.map(tagFilter => ({
        tag: tagFilter,
        onClick: () => setActiveDialog(<EditTagFilterDialog {...props} tagFilter={tagFilter} forAnalyzeCalls />),
        onRemove: () => props.removeTagFilter(tagFilter.name, null, tagFilter.secondLevelName, tagFilter.value)
      }))}
    />
  );
}
