/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import MetricValue from 'in-components/MetricValue';

export default function JiraInfo({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <DescriptionList>
      <DescriptionItem title="Version">{snapshot.getIn(['data', 'version'])}</DescriptionItem>
      <DescriptionItem title="Issues">
        <MetricValue metric={'instruments.entity.issues.total'} snapshotId={snapshotId} />
      </DescriptionItem>
      <DescriptionItem title="Workflows">
        <MetricValue metric={'instruments.entity.workflows.total'} snapshotId={snapshotId} />
      </DescriptionItem>
      <DescriptionItem title="Custom Fields">
        <MetricValue metric={'instruments.entity.customfields.total'} snapshotId={snapshotId} />
      </DescriptionItem>
    </DescriptionList>
  );
}
