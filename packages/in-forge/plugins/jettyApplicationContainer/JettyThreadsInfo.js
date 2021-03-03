/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

export default function JettyThreadsInfo({ snapshot }) {
  const data = snapshot.get('data');
  const minThreads = data.get('minThreads');
  if (!minThreads) {
    return null;
  }
  return (
    <Collapsible initiallyOpen={false}>
      <Collapsible.Header>{t('in-forge:plugins.jettyApplicationContainer.queuedThreadPool')}</Collapsible.Header>
      <Collapsible.Content>
        <DescriptionList>
          <DescriptionItem title={t('in-forge:plugins.jettyApplicationContainer.minThreads')}>
            {minThreads}
          </DescriptionItem>
          <DescriptionItem title={t('in-forge:plugins.jettyApplicationContainer.maxThreads')}>
            {data.get('maxThreads')}
          </DescriptionItem>
        </DescriptionList>
      </Collapsible.Content>
    </Collapsible>
  );
}
