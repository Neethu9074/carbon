import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import HierarchicalLink from 'in-components/Link/HierarchicalLink';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ subscription, snapshotId }) => ({
    relatedEntity: timeConfig$
      .flatMap(timeConfig => subscription({ snapshotId, timeConfig }))
      .flatMap(getSnapshot)
      .debounce(1000)
  }),
  function LinkToRelatedEntity({ relatedEntity, title, description }) {
    if (!relatedEntity) {
      return null;
    }

    return (
      <DashboardSection title={title}>
        <p>{description}</p>
        <HierarchicalLink snapshot={relatedEntity} />
      </DashboardSection>
    );
  }
);
