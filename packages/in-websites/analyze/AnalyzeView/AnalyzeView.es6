import { compose } from 'recompose';
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
  })
)(AnalyzeView);

function AnalyzeView({
  [tagFiltersMatrixParameter]: tagFilters,
  [groupMatrixParameter]: group,
  location,
  onChange,
  getChangeAsUrl
}) {
  const props = {
    tagFilters,
    group,
    timeConfig: getTimeConfig(location),
    onChange,
    getChangeAsUrl
  };

  if (group.groupbyTag) {
    return <GroupedBeacons {...props} />;
  }

  return <Beacons {...props} />;
}
