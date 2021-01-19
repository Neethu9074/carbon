/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { groupAddedTracker, groupChangedTracker, groupRemovedTracker } from 'in-analyze/tracker';
import EditGroupDialog from 'in-analyze/AnalyzeView/components/AnalyzeEditGroupDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';

/**
 * Manipulators for tag groups.
 * Can clear the tag group or set a new one, while calling the appropriate trackers.
 */
export const getTagGroupManipulators = props => {
  const { grouping, setNewGroup } = props;

  const setNewTagGroup = (newTagGroup, existingGroup) => {
    if (!existingGroup || !existingGroup.groupbyTag) {
      groupAddedTracker({ group: newTagGroup.groupbyTag });
    } else {
      groupChangedTracker({ before: existingGroup.name, after: newTagGroup.groupbyTag });
    }
    setNewGroup(newTagGroup);
  };

  const existingTagGroup = grouping?.by ?? null;

  return {
    clearTagGroup() {
      setNewGroup(null);
      groupRemovedTracker();
    },
    setTagGroup(newTagGroup) {
      setNewTagGroup(newTagGroup, existingTagGroup);
    },
    onMoreClick() {
      addActiveDialog(
        <EditGroupDialog
          {...props}
          tagFilters={null}
          timeConfig={props.timeConfig}
          group={props.tagGroup}
          setGroup={newTagGroup => setNewTagGroup(newTagGroup, existingTagGroup)}
          forAnalyzeCalls
        />
      );
    }
  };
};
