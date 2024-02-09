/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fromJS } from 'immutable';
import React from 'react';

import { Snapshot, TimeConfig } from '@instana/types';

// @ts-expect-error needs ts migration
import { getLabel } from 'in-sdk/snapshot';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import EntityLink from 'in-components/EntityLink';

function PhysicalDashboardEntityLink({ item, timeConfig }: { item: Snapshot; timeConfig: TimeConfig }) {
  const snapshot = fromJS(item);

  const getHref = useGetDashboardLink();
  const href =
    item.id &&
    getHref(item.id, {
      pathname: '/physical/dashboard',
      timeConfig: {
        ...timeConfig,
        focusedMoment: timeConfig.to
      }
    });

  return <EntityLink snapshot={snapshot.id} label={getLabel(snapshot)} href={href} />;
}

export default PhysicalDashboardEntityLink;
