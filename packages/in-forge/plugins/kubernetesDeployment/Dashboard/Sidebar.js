/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import ConditionsList from '../Sidebar/ConditionsList';
import Info from '../Info';

export default function KubernetesDeploymentSidebar({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.kubernetesDeployment.kubernetesDeployment')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <ConditionsList snapshot={snapshot} />

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>{t('in-forge:plugins.kubernetesDeployment.kubectl')}</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title={t('in-forge:plugins.kubernetesDeployment.describe')}>
              <code>
                kubectl describe deployment -n {data.get('namespace')} {data.get('name')}
              </code>
            </DescriptionItem>
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
