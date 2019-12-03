import React from 'react';

import GroupedProcessesTable from 'in-profiling/analyze/AnalyzeView/GroupedProfiledProcesses/GroupedProcessesTable';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import ProfileTagFilterList from 'in-profiling/analyze/AnalyzeView/ProfileTagFilterList';
import QuickFilterBar from 'in-analyze/AnalyzeView/components/QuickFilterBar';
import GroupingTableHeader from 'in-analyze/components/GroupingTableHeader';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';

export default function GroupedProcessesRenderer(props) {
  return (
    <>
      <Title title="Analyze process groups" />
      <Sticky
        header={
          <>
            <AnalyzeHeader isGrouped />
            <QuickFilterBar {...props} />
          </>
        }
      >
        <MaxWidthFullscreenContainer>
          <ProfileTagFilterList {...props} />
          <GroupingTableHeader {...props} itemType="Group" />
          <GroupedProcessesTable {...props} />
        </MaxWidthFullscreenContainer>
      </Sticky>
    </>
  );
}
