import React from 'react';

import ReleaseMarkerLanePresenter from 'in-components/Chart/markerLanes/ReleaseMarkerLane/ReleaseMarkerLanePresenter';
import { pendingResult, emptyArray } from 'in-services/fixedObjects';
import getReleases from 'in-events/subscriptions/getReleases';
import useObservable from 'in-hooks/useObservable';

export default function ReleaseMarkerLane(props) {
  const releases =
    useObservable(
      getReleases({
        timeConfig: props.timeConfig,
        pagination: {
          page: 1,
          pageSize: 100
        }
      })
        .startWith(pendingResult)
        .map(({ data }) => data?.items ?? []),
      [props.timeConfig]
    ) ?? emptyArray;

  return <ReleaseMarkerLanePresenter {...props} releases={releases} />;
}
