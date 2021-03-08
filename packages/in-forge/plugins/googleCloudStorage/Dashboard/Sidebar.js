/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from 'in-forge/plugins/googleCloudStorage/Info';
import TagList from 'in-sdk/components/sidebar/TagList';
import { t } from 'in-i18n';

export default function GoogleCloudStorageSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.googleCloudStorage.dashboard.info')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <TagList snapshot={snapshot} />

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
