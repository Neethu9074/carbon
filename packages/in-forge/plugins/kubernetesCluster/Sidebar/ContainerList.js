/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { emptyList } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

export default function ContainerList({ snapshot }) {
  const containers = snapshot.getIn(['data', 'spec', 'containers'], emptyList);

  if (containers.size === 0) {
    return null;
  }

  return (
    <Collapsible initiallyOpen={false}>
      <Collapsible.Header>
        {t('in-forge:plugins.kubernetesCluster.containersSize', { size: containers.size })}
      </Collapsible.Header>
      <Collapsible.Content>
        <DescriptionList>
          {containers.toArray().map(c => (
            <DescriptionItem key={c.get('image')}>
              {c.get('name')} ({c.get('image')})
            </DescriptionItem>
          ))}
        </DescriptionList>
      </Collapsible.Content>
    </Collapsible>
  );
}
