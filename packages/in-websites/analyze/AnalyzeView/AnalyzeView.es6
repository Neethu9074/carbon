import { compose, withProps } from 'recompose';
import React from 'react';

import {
  group as groupMatrixParameter,
  tagFilters as tagFiltersMatrixParameter,
  deserializeGroup,
  serializeGroup,
  serializeTagFilters,
  deserializeTagFilters
} from 'in-websites/navigation/matrix';
import WebsiteEditGroupDialog from 'in-websites/analyze/AnalyzeView/WebsiteEditGroupDialog';
import GroupedBeacons from 'in-websites/analyze/AnalyzeView/GroupedBeacons/GroupedBeacons';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import Beacons from 'in-websites/analyze/AnalyzeView/Beacons/Beacons';
import { tagFilterManipulators } from 'in-websites/tagFiltersHoc';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { analyzePath } from 'in-websites/navigation/paths';
import { getTimeConfig } from 'in-stores/time/config';
import { tagKeys } from 'in-websites/tags';

export default compose(
  withUrlDependingState({
    replaceHistory: false,
    getPathSegment: () => analyzePath,
    getMatrixPrefix: () => '',
    boundKeys: [tagFiltersMatrixParameter, groupMatrixParameter],
    getInitialState: () => ({
      [tagFiltersMatrixParameter]: [],
      [groupMatrixParameter]: { groupbyTag: 'beacon.location.path' }
    }),
    reducerName: 'onChange',
    reduceAndGetAsUrlName: 'getChangeAsUrl',
    getParsedUrlValues: props => ({
      [tagFiltersMatrixParameter]: deserializeTagFilters(props[tagFiltersMatrixParameter]),
      [groupMatrixParameter]: deserializeGroup(props[groupMatrixParameter])
    }),
    getSerializedUrlValues: props => ({
      [tagFiltersMatrixParameter]: serializeTagFilters(props[tagFiltersMatrixParameter]),
      [groupMatrixParameter]: serializeGroup(props[groupMatrixParameter])
    })
  }),
  withProps(({ onChange, location }) => ({
    setTagFilters: tagFilters => onChange({ [tagFiltersMatrixParameter]: tagFilters }),
    setGroup: group => onChange({ [groupMatrixParameter]: group }),
    timeConfig: getTimeConfig(location)
  })),
  withProps(({ group, setGroup, timeConfig, tagFilters }) => ({
    onEditGroupDialog() {
      setActiveDialog(
        <WebsiteEditGroupDialog
          setGroup={setGroup}
          group={group}
          tagSuggestions={tagKeys}
          timeConfig={timeConfig}
          tagFilters={tagFilters}
        />
      );
    }
  })),
  tagFilterManipulators
)(AnalyzeView);

function AnalyzeView({
  [tagFiltersMatrixParameter]: tagFilters,
  [groupMatrixParameter]: group,
  timeConfig,
  onChange,
  getChangeAsUrl,
  removeTagFilter,
  upsertTagFilter,
  clearTagFilters,
  setTagFilters,
  addTagFilter,
  onMoreClick,
  onTagFilterClick,
  setGroup,
  onEditGroupDialog
}) {
  const props = {
    tagFilters,
    group,
    timeConfig,
    onChange,
    getChangeAsUrl,
    removeTagFilter,
    upsertTagFilter,
    clearTagFilters,
    setTagFilters,
    addTagFilter,
    onMoreClick,
    onTagFilterClick,
    setGroup,
    onEditGroupDialog
  };

  if (group.groupbyTag) {
    return <GroupedBeacons {...props} />;
  }

  return <Beacons {...props} />;
}
