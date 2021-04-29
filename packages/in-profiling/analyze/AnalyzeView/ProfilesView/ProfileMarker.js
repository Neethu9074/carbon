/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Link } from '@instana/components';
import React from 'react';

import LaneIcon from 'in-components/Chart/markerLanes/MarkerLane/LaneIcon';

export default function ProfileMarker({ getHref$, eventData, ...remainingProps }) {
  return (
    <Link href$={getHref$(eventData)}>
      <LaneIcon {...remainingProps} eventData={eventData} />
    </Link>
  );
}
