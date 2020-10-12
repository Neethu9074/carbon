import { compose, withProps } from 'recompose';
import React from 'react';

import TagGroupConfigurationWrapper from 'in-analyze/AnalyzeView/components/TagGroupConfigurationWrapper';
import { convertToApplicationAreaSpecificTagFilter } from 'in-analyze/applicationFilter';
import EditGroupDialog from 'in-analyze/AnalyzeView/components/AnalyzeEditGroupDialog';
import QuickGroupBar from 'in-analyze/AnalyzeView/components/QuickGroupBar';
import TagGroupList from 'in-analyze/AnalyzeView/components/TagGroupList';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { tagGroupManipulators } from 'in-analyze/tagGroupHoc';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

/**
 * The component to introduce grouping to the metrics configuration.
 * This function extracts the tag filters (same as the component dedicated to tag filters) as well as the grouping object.
 * Further functions are introduced through a tag group HOC.
 */
export default compose(
  connectTo({
    timeConfig: timeConfig$
  }),
  withProps(({ tagFilters, grouping, timeConfig, onByChange, onDirectionChange, onMaxResultsChange }) => {
    const applicationAreaSpecificTagFilters = convertToApplicationAreaSpecificTagFilter(tagFilters);
    return {
      tagFilters: applicationAreaSpecificTagFilters,
      filters: {
        dataSource: 'calls',
        timeConfig,
        tagFilter: applicationAreaSpecificTagFilters
      },
      grouping: grouping,
      onDirectionChange: onDirectionChange,
      onMaxResultsChange: onMaxResultsChange,
      setNewGroup: newGroup => onByChange(newGroup)
    };
  }),
  tagGroupManipulators
)(QuickGroupForm);

/**
 * The presentation of the component.
 * The extracted values are passed to a TagGroupConfigurationWrapper, which handles the presentation.
 * A QuickGroupBar is introduced to quickly switch between groups.
 * The TagGroupList is defined to show and edit the current group.
 */
function QuickGroupForm(props) {
  const {
    tagFilters,
    grouping,
    clearTagGroup,
    excludedTagFilters,
    setNewGroup,
    onDirectionChange,
    onMaxResultsChange,
    disabled,
    isMultiMetrics
  } = props;
  return (
    <TagGroupConfigurationWrapper
      grouping={grouping}
      onDirectionChange={onDirectionChange}
      onMaxResultsChange={onMaxResultsChange}
      quickGroupBar={
        <QuickGroupBar {...props} tagFilter={tagFilters} grouping={grouping} excludedTagFilters={excludedTagFilters} />
      }
      isEmpty={grouping?.get('by')?.value == null}
      disabled={disabled}
      isMultiMetrics={isMultiMetrics}
      tagGroupList={
        <TagGroupList
          {...props}
          tagGroupEntry={{
            tag: grouping?.get('by')?.value ?? null,
            onClick: () =>
              addActiveDialog(
                <EditGroupDialog
                  {...props}
                  tagFilters={null}
                  timeConfig={props.timeConfig}
                  group={grouping?.get('by')?.value}
                  setGroup={newTagGroup => setNewGroup(newTagGroup)}
                  forAnalyzeCalls
                />
              ),
            onRemove: () => clearTagGroup()
          }}
        />
      }
    />
  );
}
