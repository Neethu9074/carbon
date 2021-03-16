/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

/**
 * The presentation of the component.
 * The extracted values are passed to a TagGroupConfigurationWrapper, which handles the presentation.
 * A QuickGroupBar is introduced to quickly switch between groups.
 * The TagGroupList is defined to show and edit the current group.
 */
import useTimeConfig from 'in-hooks/useTimeConfig';
import TagGroupConfigurationWrapper from 'in-analyze/AnalyzeView/components/TagGroupConfigurationWrapper';
import { convertToApplicationAreaSpecificTagFilter } from 'in-analyze/applicationFilter';
import EditGroupDialog from 'in-analyze/AnalyzeView/components/AnalyzeEditGroupDialog';
import QuickGroupBar from 'in-analyze/AnalyzeView/components/QuickGroupBar';
import TagGroupList from 'in-analyze/AnalyzeView/components/TagGroupList';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { getTagGroupManipulators } from 'in-analyze/tagGroupHoc';

/**
 * The component to introduce grouping to the metrics configuration.
 * This function extracts the tag filters (same as the component dedicated to tag filters) as well as the grouping object.
 * Further functions are introduced through a tag group HOC.
 */
export default function QuickGroupForm(props) {
  const { tagFilterExpression, grouping, onChange, excludedTagFilters } = props;
  const timeConfig = useTimeConfig();
  const onByChange = by => onChange({ ...grouping, by });
  const onDirectionChange = direction => onChange({ ...grouping, direction });
  const onMaxResultsChange = maxResults => onChange({ ...grouping, maxResults });
  const onIncludeOthersChange = includeOthers => onChange({ ...grouping, includeOthers });
  const applicationAreaSpecificTagFilters = tagFilters
    ? convertToApplicationAreaSpecificTagFilter(tagFilters)
    : undefined;
  const tagFilters = applicationAreaSpecificTagFilters;
  const filters = {
    dataSource: 'calls',
    timeConfig,
    tagFilter: applicationAreaSpecificTagFilters,
    tagFilterExpression
  };
  const setNewGroup = newGroup =>
    onByChange({
      ...newGroup,
      groupbyTagEntity: newGroup.entity || newGroup.entityType || newGroup.groupbyTagEntity
    });
  const clearTagGroup = () => onByChange(null);

  let allProps = {
    ...props,
    timeConfig,
    onByChange,
    onDirectionChange,
    onMaxResultsChange,
    onIncludeOthersChange,
    applicationAreaSpecificTagFilters,
    tagFilters,
    filters,
    setNewGroup
  };
  allProps = {
    ...allProps,
    ...getTagGroupManipulators({ ...allProps, grouping, setNewGroup, clearTagGroup })
  };

  return (
    <TagGroupConfigurationWrapper
      grouping={grouping}
      onDirectionChange={onDirectionChange}
      onIncludeOthersChange={onIncludeOthersChange}
      onMaxResultsChange={onMaxResultsChange}
      quickGroupBar={
        <QuickGroupBar
          {...allProps}
          tagFilter={tagFilters}
          tagFilterExpression={tagFilterExpression}
          grouping={grouping}
          excludedTagFilters={excludedTagFilters}
        />
      }
      tagGroupList={
        <TagGroupList
          {...allProps}
          tagGroupEntry={{
            tag: grouping?.by ?? null,
            onClick: () =>
              addActiveDialog(
                <EditGroupDialog
                  {...allProps}
                  tagFilters={null}
                  group={{
                    ...(grouping?.by ?? {}),
                    // EditGroupDialog does not understand the groupbyTagEntity field
                    entity: grouping?.by?.groupbyTagEntity
                  }}
                  setGroup={newTagGroup =>
                    setNewGroup({
                      ...newTagGroup,
                      groupbyTagEntity: newTagGroup.entity
                    })
                  }
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
