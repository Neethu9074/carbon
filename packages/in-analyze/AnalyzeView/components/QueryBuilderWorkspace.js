import React from 'react';

import EditTagFilterDialog from 'in-analyze/AnalyzeView/components/AnalyzeEditTagFilterDialog';
import AnalyzeGroupingInfo from 'in-analyze/AnalyzeView/components/AnalyzeEditGroupingInfo';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import QuickFilterBar from 'in-analyze/AnalyzeView/components/QuickFilterBar';
import TagFilterList from 'in-analyze/AnalyzeView/components/TagFilterList';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { setActiveDialog } from 'in-components/DialogPresenter/store';

import Sticky from 'in-components/Sticky';

export default function QueryBuilderWorkspace(props) {
  const { filters, groupBy, removeTagFilter } = props;
  const tagFilters = filters.tagFilter;
  const timeConfig = filters.timeConfig;
  return (
    <Sticky
      header={
        <div>
          <QuickFilterBar {...props} />
        </div>
      }
    >
      <MaxWidthFullscreenContainer>
        <TagFilterList
          tagFilters={tagFilters.map(tagFilter => ({
            tag: tagFilter,
            onClick: () => setActiveDialog(<EditTagFilterDialog {...props} tagFilter={tagFilter} forAnalyzeCalls />),
            onRemove: () => removeTagFilter(tagFilter.name, null, tagFilter.secondLevelName, tagFilter.value)
          }))}
          defaultFilters={getConfigByDataSource(filters.dataSource).defaultFilters}
        />
        <AnalyzeGroupingInfo {...props} group={groupBy} timeConfig={timeConfig} tagFilters={tagFilters} />
      </MaxWidthFullscreenContainer>
    </Sticky>
  );
}
