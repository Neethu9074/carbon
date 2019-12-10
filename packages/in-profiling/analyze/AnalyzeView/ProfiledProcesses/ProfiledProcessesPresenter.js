import React from 'react';

import ProfiledProcessesTable from 'in-profiling/analyze/AnalyzeView/ProfiledProcesses/ProfiledProcessesTable';
import ProfileTagFilterList from 'in-profiling/analyze/AnalyzeView/ProfileTagFilterList';
import QuickFilterBar from 'in-analyze/AnalyzeView/components/QuickFilterBar';
import GroupingTableHeader from 'in-analyze/components/GroupingTableHeader';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
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
            <AnalyzeHeader
              renderQuickFilterBar={() => <QuickFilterBar showWebsiteSelector showPageSelector {...props} />}
            />
          </>
        }
      >
        <LeftRightPadding>
          <ProfileTagFilterList {...props} />
          <GroupingTableHeader {...props} />
          <ProfiledProcessesTable {...props} />
        </LeftRightPadding>
      </Sticky>
    </>
  );
}
