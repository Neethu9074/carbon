import React from 'react';

import ProfiledProcessesTable from 'in-profiling/analyze/AnalyzeView/ProfiledProcesses/ProfiledProcessesTable';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import ProfileTagFilterList from 'in-profiling/analyze/AnalyzeView/ProfileTagFilterList';
import QuickFilterBar from 'in-analyze/AnalyzeView/components/QuickFilterBar';
import GroupingTableHeader from 'in-analyze/components/GroupingTableHeader';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';

export default function ProfiledProcessesPresenter(props) {
  return (
    <>
      <Title title="Analyze profiles" />
      <Sticky
        header={
          <>
            <AnalyzeHeader />
            <QuickFilterBar showWebsiteSelector showPageSelector {...props} />
          </>
        }
      >
        <MaxWidthFullscreenContainer>
          <ProfileTagFilterList {...props} />
          <GroupingTableHeader {...props} />
          <ProfiledProcessesTable {...props} />
        </MaxWidthFullscreenContainer>
      </Sticky>
    </>
  );
}
