/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React, { ForwardedRef, forwardRef } from 'react';

import { SliCreationMarkerLaneEvent } from 'in-custom-dashboards/widgets/Slo/components/Chart/SliCreationMarkerLane';
import SingleMarkerLaneItem from 'in-components/Chart/markerLanes/MarkerLane/SingleMarkerLaneItem';
import { LaneItemProps } from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';
import LaneIcon from 'in-components/Chart/markerLanes/MarkerLane/LaneIcon';
import theme from 'in-themes';

export default forwardRef(function SliCreationMarkerLaneItem(
  props: LaneItemProps<SliCreationMarkerLaneEvent>,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <SingleMarkerLaneItem<SliCreationMarkerLaneEvent>
      ref={ref}
      renderMarkerItem={p => (
        <LaneIcon
          {...p}
          iconConfig={{
            type: 'lib_help_error_info_outline',
            typeCluster: '',
            color: theme.lib.colors.N700Medium
          }}
        />
      )}
      {...props}
    />
  );
});
