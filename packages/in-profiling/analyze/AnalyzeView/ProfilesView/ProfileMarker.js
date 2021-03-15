/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import LaneIcon from 'in-components/Chart/markerLanes/MarkerLane/LaneIcon';
import Link from 'in-components/Link';

export default function ProfileMarker({ getHref$, eventData, ...remainingProps }) {
  return (
    <Link href$={getHref$(eventData)}>
      <LaneIcon {...remainingProps} eventData={eventData} />
    </Link>
  );
}
