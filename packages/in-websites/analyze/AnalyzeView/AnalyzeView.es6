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
import { addGroupToTagFilter } from 'in-analyze/filterBuilder';
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
    disableGrouping: () => onChange({ [groupMatrixParameter]: {} }),
    timeConfig: getTimeConfig(location)
  })),
  withProps(({ group, setGroup, timeConfig, tagFilters, getChangeAsUrl }) => ({
    openEditGroupDialog() {
      setActiveDialog(
        <WebsiteEditGroupDialog
          setGroup={setGroup}
          group={group}
          tagSuggestions={tagKeys}
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
