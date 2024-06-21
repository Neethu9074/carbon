/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Collapsible, DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';
import Info from '../Info';

export default function KubernetesNamespaceSidebar({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.kubernetesNamespace.kubernetesNamespace')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>{t('in-forge:plugins.kubernetesNamespace.kubectl')}</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title={t('in-forge:plugins.kubernetesNamespace.describe')}>
              <code>kubectl describe namespace {data.get('name')}</code>
            </DescriptionItem>
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
