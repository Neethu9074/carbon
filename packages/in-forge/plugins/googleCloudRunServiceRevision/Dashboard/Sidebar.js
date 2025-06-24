/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Collapsible } from '@instana/components';
import { useObservable } from '@instana/hooks';

import RemoteServiceAgentCorrelationComponent from 'in-sdk/components/sidebar/remoteServiceAgentCorrelation/remoteServiceAgentCorrelationComponent';
import getRuntimesForGoogleCloudRunServiceRevision from 'in-subscription/getRuntimesForGoogleCloudRunServiceRevision';
import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import Info from 'in-forge/plugins/googleCloudRunServiceRevision/Info';
import TagList from 'in-sdk/components/sidebar/TagList';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshot } from 'in-stores/snapshot';
import { t } from 'in-i18n';

export default function GoogleCloudRunServiceRevisionSidebar({ snapshot }) {
  const snapshotId = snapshot.get('id');

  // We need a snapshot of one of the instances to get hold of the service for this cloud run service revision.
  // (Calls are linked to the instances).
  const arbitraryInstanceSnapshot = useObservable(
    timeConfig$
      .flatMap(timeConfig => getRuntimesForGoogleCloudRunServiceRevision({ snapshotId, timeConfig }))
      .map(instanceSnapshots => instanceSnapshots?.[0])
      .flatMap(getSnapshot),
    [snapshotId]
  );

  return (
    <>
      <Collapsible initiallyOpen>
        <Collapsible.Header>
          {t('in-forge:plugins.googleCloudRunServiceRevision.dashboard.cloudRunServiceRevisionInfo')}
        </Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <TagList snapshot={snapshot} />

      <KeyValueOverlay
        header={t('in-forge:plugins.googleCloudRunServiceRevision.dashboard.labels')}
        data={snapshot.getIn(['data', 'labels'])}
      />

      <RunningComponentsList snapshotId={snapshot.get('id')} />

      {arbitraryInstanceSnapshot && <ServiceInstancesList snapshot={arbitraryInstanceSnapshot} />}
      <RemoteServiceAgentCorrelationComponent snapshot={snapshot} />
    </>
  );
}
