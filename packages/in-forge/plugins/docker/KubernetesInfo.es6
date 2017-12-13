import React from 'react';

import createNodeForContainerSubscription from 'in-services/subscription/nodeForContainer';
import createPodForContainerSubscription from 'in-services/subscription/podForContainer';
import createClusterForPodSubscription from 'in-services/subscription/clusterForPod';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import KeyValuePopupButton from 'in-sdk/components/sidebar/KeyValuePopupButton';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import { focusedMoment$ } from 'in-stores/timeline';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      podSnapshot: focusedMoment$
        .flatMap(time => createPodForContainerSubscription({ snapshotId: props.snapshot.get('id'), time }))
        .flatMap(getSnapshot),

      nodeSnapshot: focusedMoment$
        .flatMap(time => createNodeForContainerSubscription({ snapshotId: props.snapshot.get('id'), time }))
        .flatMap(getSnapshot),

      clusterSnapshot: focusedMoment$
        .flatMap(time => createClusterForPodSubscription({ snapshotId: props.snapshot.get('id'), time }))
        .flatMap(getSnapshot)
    };
  },
  function KubernetesInfo({ snapshot, podSnapshot, clusterSnapshot, nodeSnapshot }) {
    const labels = snapshot.getIn(['data', 'Labels']);
    if (!labels || labels.size === 0) {
      return null;
    }

    const smellsLikeKubernetes = labels.some(
      (value, key) => key.indexOf('io.kubernetes.') !== -1 || key.indexOf('annotation.io.kubernetes') === 0
    );

    if (!smellsLikeKubernetes) {
      return null;
    }

    const allKubernetesLabelsWithoutPrefix = labels
      .filter((v, k) => k.indexOf('io.kubernetes') !== -1)
      .mapKeys(k => k.replace(/^(annotation\.)?io\.kubernetes\./i, ''));

    return (
      <div>
        <Separator />

        <Collapsible initiallyOpen>
          <Collapsible.Header>Kubernetes</Collapsible.Header>
          <Collapsible.Content>
            <DescriptionList>
              <DescriptionItem title="Namespace">{labels.get('io.kubernetes.pod.namespace')}</DescriptionItem>
              {podSnapshot ? (
                <DescriptionItem title="Pod">
                  <SnapshotLink snapshotId={podSnapshot.get('id')}>{getLabel(podSnapshot)}</SnapshotLink>
                </DescriptionItem>
              ) : null}

              {nodeSnapshot ? (
                <DescriptionItem title="Node">
                  <SnapshotLink snapshotId={nodeSnapshot.get('id')}>{getLabel(nodeSnapshot)}</SnapshotLink>
                </DescriptionItem>
              ) : null}

              {clusterSnapshot ? (
                <DescriptionItem title="Cluster">
                  <SnapshotLink snapshotId={clusterSnapshot.get('id')}>{getLabel(clusterSnapshot)}</SnapshotLink>
                </DescriptionItem>
              ) : null}
              <DescriptionItem title="Restart Count">
                {labels.get('annotation.io.kubernetes.container.restartCount')}
              </DescriptionItem>
            </DescriptionList>

            {labels && labels.size > 0 ? (
              <KeyValuePopupButton title="Kubernetes Labels" data={allKubernetesLabelsWithoutPrefix}>
                Kubernetes Labels
              </KeyValuePopupButton>
            ) : null}
          </Collapsible.Content>
        </Collapsible>
      </div>
    );
  }
);
