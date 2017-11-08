import React from 'react';

import KeyValuePopup from 'in-sdk/components/sidebar/KeyValuePopup';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import connectTo from 'in-hoc/connectTo';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import { getZone } from 'in-stores/zone';

export default connectTo(
  props => {
    return {
      zoneSnapshot: getZone(props.snapshot.get('id')).flatMap(getSnapshot)
    };
  },
  function KubernetesInfo({ snapshot, zoneSnapshot }) {
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

        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Kubernetes</Collapsible.Header>
          <Collapsible.Content>
            <DescriptionList>
              <DescriptionItem title="Namespace">{labels.get('io.kubernetes.pod.namespace')}</DescriptionItem>
              {zoneSnapshot ? (
                <DescriptionItem title="Pod">
                  <SnapshotLink snapshotId={zoneSnapshot.get('id')}>{getLabel(zoneSnapshot)}</SnapshotLink>
                </DescriptionItem>
              ) : null}
              <DescriptionItem title="Restart Count">
                {labels.get('annotation.io.kubernetes.container.restartCount')}
              </DescriptionItem>
            </DescriptionList>

            {labels && labels.size > 0 ? (
              <KeyValuePopup header="Kubernetes Labels" data={allKubernetesLabelsWithoutPrefix} />
            ) : null}
          </Collapsible.Content>
        </Collapsible>
      </div>
    );
  }
);
