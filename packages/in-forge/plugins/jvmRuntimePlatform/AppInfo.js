/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

export default function AppInfo({ snapshot }) {
  const data = snapshot.get('data');
  if (!data.get('appInfo')) {
    return null;
  }

  return (
    <Collapsible initiallyOpen={false}>
      <Collapsible.Header>{t('in-forge:plugins.jvmRuntimePlatform.app')}</Collapsible.Header>
      <Collapsible.Content>
        <DescriptionList>
          <DescriptionItem title={t('in-forge:plugins.jvmRuntimePlatform.application')}>
            {data.getIn(['appInfo', 'title'])}
          </DescriptionItem>
          <DescriptionItem title={t('in-forge:plugins.jvmRuntimePlatform.version')}>
            {data.getIn(['appInfo', 'version'])}
          </DescriptionItem>
          <DescriptionItem title={t('in-forge:plugins.jvmRuntimePlatform.commandLine')}>
            {data.get('name')}
          </DescriptionItem>
        </DescriptionList>
      </Collapsible.Content>
    </Collapsible>
  );
}
