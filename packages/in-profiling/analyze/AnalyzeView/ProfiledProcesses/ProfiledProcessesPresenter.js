/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ProfiledProcessesTable from 'in-profiling/analyze/AnalyzeView/ProfiledProcesses/ProfiledProcessesTable';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import SearchBar from 'in-components/SearchBar';
import Sticky from 'in-components/Sticky';

export default function ProfiledProcessesPresenter(props) {
  return (
    <>
      <Sticky header={<AnalyzeHeader renderQuickFilterBar={() => <SearchBar theme="light" showFilters={false} />} />}>
        <LeftRightPadding>
          <ProfiledProcessesTable {...props} />
        </LeftRightPadding>
      </Sticky>
    </>
  );
}
