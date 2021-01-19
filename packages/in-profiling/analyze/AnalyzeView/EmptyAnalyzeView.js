/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
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
          icon={getIconByType(type, 'profiling')}
          explanation="No profiles are available for the selected time range."
          title={`No ${entityName} found`}
        />
      </CenterAlignmentColumn>
    </Sticky>
  );
}
