/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import getMongoDbClusterForNode from 'in-subscription/mongoDb/getMongoDbClusterForNode';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    clusterSnapshot: timeConfig$
      .flatMap(timeConfig => getMongoDbClusterForNode({ snapshotId: props.snapshotId, timeConfig }))
      .flatMap(getSnapshot)
  }),

  function MongoDbClusterInfo({ clusterSnapshot, data }) {
    if (!clusterSnapshot) {
      return null;
    }

    return (
      <div>
        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>Atlas Cluster</Collapsible.Header>
          <Collapsible.Content>
            <div>
              <DescriptionList>
                <DescriptionItem title="Name">
                  <SnapshotLink snapshotId={clusterSnapshot.get('id')}>{data.get('clusterName')}</SnapshotLink>
                </DescriptionItem>
                <DescriptionItem title="Type">{data.get('clusterType')}</DescriptionItem>
                <DescriptionItem title="Cloud Provider">{data.get('clusterProvider')}</DescriptionItem>
                <DescriptionItem title="Region">{data.get('clusterRegion')}</DescriptionItem>
                <DescriptionItem title="Project">{data.get('clusterProjectName')}</DescriptionItem>
                <DescriptionItem title="Organisation">{data.get('clusterOrganisationName')}</DescriptionItem>
              </DescriptionList>
            </div>
          </Collapsible.Content>
        </Collapsible>
      </div>
    );
  }
);
