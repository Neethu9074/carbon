/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import getDockerContainerForEcsContainer from 'in-subscription/getDockerContainerForEcsContainer';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import HierarchicalLink from 'in-components/Link/HierarchicalLink';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    container: timeConfig$
      .flatMap(timeConfig => getDockerContainerForEcsContainer({ snapshotId: props.snapshotId, timeConfig }))
      .flatMap(getSnapshot)
      .debounce(1000)
  }),
  function LinkToDockerSection({ container }) {
    if (!container) {
      return null;
    }

    return (
      <DashboardSection title="Docker Container">
        <p>
          The runtime metrics and more details for this container can be found on its corresponding Docker container
          dashboard:
        </p>
        <HierarchicalLink snapshot={container} />
      </DashboardSection>
    );
  }
);
