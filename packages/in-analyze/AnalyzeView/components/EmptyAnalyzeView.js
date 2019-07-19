import React from 'react';

import EntityPageMainNotification from 'in-new-components/EntityPageMainNotification/EntityPageMainNotification';
import { getEntityNameByType, getIconByType } from 'in-analyze/AnalyzeView/dataSources';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import Sticky from 'in-components/Sticky';

export default function EmptyAnalyzeView({ type }) {
  const entityName = getEntityNameByType(type);
  return (
    <Sticky header={<AnalyzeHeader />}>
      <CenterAlignmentColumn>
        <EntityPageMainNotification
          icon={getIconByType(type)}
          title={`No ${entityName} found`}
          explanation={`There were no ${entityName} retrieved for the selected time range.`}
        />
      </CenterAlignmentColumn>
    </Sticky>
  );
}
