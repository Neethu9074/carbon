import React from 'react';

import { groupAddedTracker, groupChangedTracker, groupRemovedTracker } from 'in-analyze/tracker';
import EditGroupDialog from 'in-analyze/AnalyzeView/components/AnalyzeEditGroupDialog';
import { groupBy as groupByMatrixParameter } from 'in-analyze/navigation/matrix';
import GroupingInfo from 'in-analyze/components/GroupingInfo/GroupingInfo';
import { setActiveDialog } from 'in-components/DialogPresenter/store';

export default function AnalyzeGroupingInfo(props) {
  const { group, timeConfig, onChangeAnalyzeConfig, tagFilters } = props;
  return (
    <GroupingInfo
      {...props}
      openEditGroupDialog={() =>
        setActiveDialog(
          <EditGroupDialog
            {...props}
            tagFilters={tagFilters}
            timeConfig={timeConfig}
            group={group}
            setGroup={_group => {
              if (!group || !group.name) {
                groupAddedTracker({ group: _group.groupbyTag });
              } else {
                groupChangedTracker({ before: group.name, after: _group.groupbyTag });
              }
              const newState = {};
              newState[groupByMatrixParameter] = { name: _group.groupbyTag, value: _group.groupbyTagSecondLevelKey };
              onChangeAnalyzeConfig(newState);
            }}
          />
        )
      }
      disableGrouping={() => {
        onChangeAnalyzeConfig({
          [groupByMatrixParameter]: {}
        });
        groupRemovedTracker({ group: group ? group.name : '' });
      }}
    />
  );
}
