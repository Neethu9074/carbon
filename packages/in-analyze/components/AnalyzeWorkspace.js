/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import EditTagFilterDialog from 'in-analyze/AnalyzeView/components/AnalyzeEditTagFilterDialog';
import QuickFilterBar from 'in-analyze/AnalyzeView/components/QuickFilterBar';
import TagFilterList from 'in-analyze/AnalyzeView/components/TagFilterList';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import Sticky from 'in-components/Sticky';

export default function AnalyzeWorkspace(props) {
  const { removeTagFilter, filters, children } = props;
  const tagFilters = filters.tagFilter;

  return (
    <>
      <Sticky
        header={
          <AnalyzeHeader
            isGrouped={filters.group && !!filters.group.name}
            renderQuickFilterBar={() => <QuickFilterBar {...props} />}
          />
        }
      />
      <LeftRightPadding>
        <TagFilterList
          tagFilters={tagFilters.map(tagFilter => ({
            tag: tagFilter,
            onClick: () => addActiveDialog(<EditTagFilterDialog {...props} tagFilter={tagFilter} forAnalyzeCalls />),
            onRemove: () =>
              removeTagFilter(tagFilter.name, null, tagFilter.secondLevelName, tagFilter.value, tagFilter.entity)
          }))}
          defaultFilters={getConfigByDataSource(filters.dataSource).defaultFilters}
        />
        {children}
      </LeftRightPadding>
    </>
  );
}
