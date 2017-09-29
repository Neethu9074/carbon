import React from 'react';

import KeyValuePopupButton from 'in-sdk/components/sidebar/KeyValuePopupButton';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

export default function MarathonInfo({ snapshot }) {
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

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>Kubernetes</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title="Namespace">{labels.get('io.kubernetes.pod.namespace')}</DescriptionItem>
            {labels.get('io.kubernetes.pod.name') ? (
              <DescriptionItem title="Pod">
                {labels.get('io.kubernetes.pod.name')} ({labels.get('io.kubernetes.pod.uid')})
              </DescriptionItem>
            ) : null}
            <DescriptionItem title="Restart Count">
              {labels.get('annotation.io.kubernetes.container.restartCount')}
            </DescriptionItem>
          </DescriptionList>

          {labels && labels.size > 0 ? (
            <KeyValuePopupButton title="Kubernetes Labels and annotations" data={allKubernetesLabelsWithoutPrefix}>
              Show all Kubernetes labels and annotations
            </KeyValuePopupButton>
          ) : null}
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
