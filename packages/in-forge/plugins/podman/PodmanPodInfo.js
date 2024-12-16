/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Collapsible, DescriptionList, DescriptionItem } from '@instana/components';

import getPodForContainerSubscription from 'in-subscription/podForContainer';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => {
    const containerSnapshotId = props.snapshot.get('id');
    const podForContainer = getPodForContainer(containerSnapshotId);

    return {
      podSnapshot: podForContainer.flatMap(getSnapshot)
    };
  },

  function PodmanPodInfo({ annotations, podid, namespace, podName }) {
    if (!annotations || annotations.size === 0) {
      return null;
    }

    const containerAnnotations = annotations.some(
      (value, key) => key.indexOf('io.kubernetes.') !== -1 || key.indexOf('io.podman.') !== -1
    );

    if (!containerAnnotations) {
      return null;
    }

    const allPodmanAnnotationsWithoutPrefix = annotations
      .filter(
        (v, k) =>
          k.indexOf('io.kubernetes') !== -1 || k.indexOf('io.podman') !== -1 || k.indexOf('io.container.') !== -1
      )
      .mapKeys(
        k => k.replace(/^(annotation\.)?io\.podman\./i, '') || k.replace(/^(annotation\.)?io\.kubernetes\./i, '')
      );

    return (
      <div>
        <Collapsible initiallyOpen>
          <Collapsible.Header>Podman Pod Info</Collapsible.Header>
          <Collapsible.Content>
            {
              <DescriptionList>
                {namespace ? (
                  <DescriptionItem title={t('in-infrastructure:dashboard.namespace')}>{namespace}</DescriptionItem>
                ) : null}

                {podName ? (
                  <DescriptionItem title={t('in-infrastructure:dashboard.podName')}>{podName}</DescriptionItem>
                ) : null}

                {podid ? (
                  <DescriptionItem title={t('in-infrastructure:dashboard.podId')}>{podid}</DescriptionItem>
                ) : null}
              </DescriptionList>
            }

            {annotations && annotations.size > 0 ? (
              <KeyValueOverlay
                header={t('in-infrastructure:dashboard.podmanAnnotations')}
                data={allPodmanAnnotationsWithoutPrefix}
              />
            ) : null}
          </Collapsible.Content>
        </Collapsible>
      </div>
    );
  }
);

function getPodForContainer(snapshotId) {
  return timeConfig$.flatMap(timeConfig => getPodForContainerSubscription({ snapshotId, timeConfig }));
}
