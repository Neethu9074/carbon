/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import Info from '../Info';

export default function ReplicaSetSidebar({ snapshot }) {
  const data = snapshot.get('data');
  const clusterName = data.get('clusterName');
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>MongoDB Replica Set</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {clusterName ? (
        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>Atlas Cluster</Collapsible.Header>
          <Collapsible.Content>
            <DescriptionList>
              <DescriptionItem title="Name">{data.get('clusterName')}</DescriptionItem>
              <DescriptionItem title="Type">{data.get('clusterType')}</DescriptionItem>
              <DescriptionItem title="Cloud Provider">{data.get('clusterProvider')}</DescriptionItem>
              <DescriptionItem title="Region">{data.get('clusterRegion')}</DescriptionItem>
              <DescriptionItem title="Project">{data.get('clusterProjectName')}</DescriptionItem>
              <DescriptionItem title="Organisation">{data.get('clusterOrganisationName')}</DescriptionItem>
            </DescriptionList>
          </Collapsible.Content>
        </Collapsible>
      ) : null}

      <ServiceInstancesList snapshot={snapshot} />

      <ClusterMemberList snapshotId={snapshot.get('id')} />
    </div>
  );
}
