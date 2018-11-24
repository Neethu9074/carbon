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
import GroupedBeacons from 'in-websites/analyze/AnalyzeView/GroupedBeacons/GroupedBeacons';
import Beacons from 'in-websites/analyze/AnalyzeView/Beacons/Beacons';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { analyzePath } from 'in-websites/navigation/paths';
import { getTimeConfig } from 'in-stores/time/config';

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
  withProps(({ [tagFiltersMatrixParameter]: tagFilters, onChange }) => ({
    removeTagFilter(name) {
      onChange({
        [tagFiltersMatrixParameter]: tagFilters.filter(f => f.name !== name)
      });
    },
    upsertTagFilter(newTagFilter) {
      onChange({
        [tagFiltersMatrixParameter]: tagFilters.filter(f => f.name !== newTagFilter.name).concat(newTagFilter)
      });
    },
    clearTagFilters() {
      onChange({
        [tagFiltersMatrixParameter]: []
      });
    }
  }))
)(AnalyzeView);

function AnalyzeView({
  [tagFiltersMatrixParameter]: tagFilters,
  [groupMatrixParameter]: group,
  location,
  onChange,
  getChangeAsUrl,
  removeTagFilter,
  upsertTagFilter,
  clearTagFilters
}) {
  const props = {
    tagFilters,
    group,
    timeConfig: getTimeConfig(location),
    onChange,
    getChangeAsUrl,
    removeTagFilter,
    upsertTagFilter,
    clearTagFilters
  };

  if (group.groupbyTag) {
    return <GroupedBeacons {...props} />;
  }

  return <Beacons {...props} />;
}
