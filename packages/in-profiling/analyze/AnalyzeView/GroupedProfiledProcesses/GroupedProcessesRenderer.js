import React from 'react';

import GroupedProcessesTableHeader from 'in-profiling/analyze/AnalyzeView/GroupedProfiledProcesses/GroupedProcessesTableHeader';
import GroupedProcessesTable from 'in-profiling/analyze/AnalyzeView/GroupedProfiledProcesses/GroupedProcessesTable';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import ProfileTagFilterList from 'in-profiling/analyze/AnalyzeView/ProfileTagFilterList';
import QuickFilterBar from 'in-analyze/AnalyzeView/components/QuickFilterBar';
import GroupingInfo from 'in-analyze/components/GroupingInfo/GroupingInfo';
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
          <GroupingInfo {...props} />
          <GroupedProcessesTableHeader {...props} />
          <GroupedProcessesTable {...props} />
        </MaxWidthFullscreenContainer>
      </Sticky>
    </>
  );
}
