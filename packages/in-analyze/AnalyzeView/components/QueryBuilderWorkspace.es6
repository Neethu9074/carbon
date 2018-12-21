import React from 'react';

import EditTagFilterDialog from 'in-analyze/AnalyzeView/components/AnalyzeEditTagFilterDialog';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import AnalyzeGroupingInfo from 'in-analyze/AnalyzeView/components/AnalyzeEditGroupingInfo';
import QuickFilterBar from 'in-analyze/AnalyzeView/components/QuickFilterBar';
import TagFilterList from 'in-analyze/AnalyzeView/components/TagFilterList';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { setActiveDialog } from 'in-components/DialogPresenter/store';

import Sticky from 'in-components/Sticky';

import locals from './QueryBuilderWorkspace.mless';

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
        <div className={locals.filterRow}>
          <TagFilterList
            tagFilters={tagFilters.map(tagFilter => ({
              tag: tagFilter,
              onClick: () => setActiveDialog(<EditTagFilterDialog {...props} tagFilter={tagFilter} forAnalyzeCalls />),
              onRemove: () => removeTagFilter(tagFilter.name)
            }))}
            defaultFilters={getConfigByDataSource(filters.dataSource).defaultFilters}
          />
        </div>
        <AnalyzeGroupingInfo {...props} group={groupBy} timeConfig={timeConfig} tagFilters={tagFilters} />
      </MaxWidthFullscreenContainer>
    </Sticky>
  );
}
