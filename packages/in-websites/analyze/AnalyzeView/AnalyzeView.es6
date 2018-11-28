import { compose, withProps } from 'recompose';
import React from 'react';

import {
  group as groupMatrixParameter,
  tagFilters as tagFiltersMatrixParameter,
  deserializeGroup,
  serializeGroup,
  serializeTagFilters,
  deserializeTagFilters,
  beaconType as beaconTypeMatrixParameter
} from 'in-websites/navigation/matrix';
import WebsiteEditGroupDialog from 'in-websites/analyze/AnalyzeView/WebsiteEditGroupDialog';
import GroupedBeacons from 'in-websites/analyze/AnalyzeView/GroupedBeacons/GroupedBeacons';
import { availableGroupingTags, availableFilterTags } from 'in-websites/tags';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import Beacons from 'in-websites/analyze/AnalyzeView/Beacons/Beacons';
import { tagFilterManipulators } from 'in-websites/tagFiltersHoc';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { addGroupToTagFilter } from 'in-analyze/filterBuilder';
import { analyzePath } from 'in-websites/navigation/paths';
import { getTimeConfig } from 'in-stores/time/config';

export default compose(
  withUrlDependingState({
    replaceHistory: false,
    getPathSegment: () => analyzePath,
    getMatrixPrefix: () => '',
    boundKeys: [tagFiltersMatrixParameter, groupMatrixParameter, beaconTypeMatrixParameter],
    getInitialState: () => ({
      [tagFiltersMatrixParameter]: [],
      [groupMatrixParameter]: { groupbyTag: 'beacon.location.path' },
      [beaconTypeMatrixParameter]: 'pageLoad'
    }),
    reducerName: 'onChange',
    reduceAndGetAsUrlName: 'getChangeAsUrl',
    getParsedUrlValues: props => ({
      [tagFiltersMatrixParameter]: deserializeTagFilters(props[tagFiltersMatrixParameter]),
      [groupMatrixParameter]: deserializeGroup(props[groupMatrixParameter]),
      [beaconTypeMatrixParameter]: props[beaconTypeMatrixParameter]
    }),
    getSerializedUrlValues: props => ({
      [tagFiltersMatrixParameter]: serializeTagFilters(props[tagFiltersMatrixParameter]),
      [groupMatrixParameter]: serializeGroup(props[groupMatrixParameter]),
      [beaconTypeMatrixParameter]: props[beaconTypeMatrixParameter]
    })
  }),
  withProps(({ onChange, location, [beaconTypeMatrixParameter]: beaconType }) => ({
    setTagFilters: tagFilters => onChange({ [tagFiltersMatrixParameter]: tagFilters }),
    setGroup: group => onChange({ [groupMatrixParameter]: group }),
    disableGrouping: () => onChange({ [groupMatrixParameter]: {} }),
    timeConfig: getTimeConfig(location),
    groupableTags: availableGroupingTags[beaconType],
    filterableTags: availableFilterTags[beaconType]
  })),
  withProps(({ group, setGroup, timeConfig, tagFilters, getChangeAsUrl, groupableTags }) => ({
    openEditGroupDialog() {
      setActiveDialog(
        <WebsiteEditGroupDialog
          setGroup={setGroup}
          group={group}
          tagSuggestions={groupableTags}
          timeConfig={timeConfig}
          tagFilters={tagFilters}
        />
      );
    },
    getGroupAsFilterUrl: subGroupName =>
      getChangeAsUrl({
        [tagFiltersMatrixParameter]: addGroupToTagFilter(tagFilters, group, subGroupName),
        [groupMatrixParameter]: {}
      })
  })),
  tagFilterManipulators
)(AnalyzeView);

function AnalyzeView(props) {
  if (props.group.groupbyTag) {
    return <GroupedBeacons {...props} />;
  }

  return <Beacons {...props} />;
}
