/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { groupBy as groupByMatrixParameter } from 'in-analyze/navigation/matrix';
import GroupingInfo from 'in-analyze/components/GroupingInfo/GroupingInfo';
import { groupRemovedTracker } from 'in-analyze/tracker';

export default function AnalyzeGroupingInfo(props) {
  const { group, onChangeAnalyzeConfig } = props;
  return (
    <GroupingInfo
      {...props}
      disableGrouping={() => {
        onChangeAnalyzeConfig({
          [groupByMatrixParameter]: {}
        });
        groupRemovedTracker({ group: group ? group.name : '' });
      }}
    />
  );
}
