/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React, { ForwardedRef, forwardRef } from 'react';

import { themes } from '@instana/design-tokens';

import { LaneItemProps, MarkerLaneEvent } from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';
import SingleMarkerLaneItem from 'in-components/Chart/markerLanes/MarkerLane/SingleMarkerLaneItem';
import LaneIcon from 'in-components/Chart/markerLanes/MarkerLane/LaneIcon';

export default forwardRef(function SliCreationMarkerLaneItem(
  props: LaneItemProps<MarkerLaneEvent>,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <SingleMarkerLaneItem<MarkerLaneEvent>
      ref={ref}
      renderMarkerItem={p => (
        <LaneIcon
          {...p}
          iconConfig={{
            type: 'lib_help_error_info_outline',
            typeCluster: '',
            color: themes.default.ids.color.option.neutral['700']
          }}
        />
      )}
      {...props}
    />
  );
});
