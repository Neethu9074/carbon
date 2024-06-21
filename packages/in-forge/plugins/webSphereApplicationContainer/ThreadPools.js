/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Collapsible, DescriptionList, DescriptionItem } from '@instana/components';

import { yesOrNo } from 'in-services/formatters/boolean';
import { t } from 'in-i18n';

export default function JettyThreadsInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <div>
      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>
          {t('in-forge:plugins.webSphereAppContainer.headerWebContainerThreadPool')}
        </Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title={t('in-forge:plugins.webSphereAppContainer.titleMinThreads')}>
              {data.get('threadPools.webContainer.minimumSize')}
            </DescriptionItem>
            <DescriptionItem title={t('in-forge:plugins.webSphereAppContainer.titleMaxThreads')}>
              {data.get('threadPools.webContainer.maximumSize')}
            </DescriptionItem>
            <DescriptionItem title={t('in-forge:plugins.webSphereAppContainer.titleInactivityTimeout')}>
              {data.get('threadPools.webContainer.inactivityTimeout')}
            </DescriptionItem>
            <DescriptionItem title={t('in-forge:plugins.webSphereAppContainer.titleGrowable')}>
              {yesOrNo(data.get('threadPools.webContainer.growable'))}
            </DescriptionItem>
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
