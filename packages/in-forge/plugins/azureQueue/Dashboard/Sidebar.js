/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { Fragment } from 'react';

import { Collapsible } from '@instana/components';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import { t } from 'in-i18n';
import Info from '../Info';

export default function AzureQueueSidebarDetails({ snapshot }) {
  return (
    <>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.azureQueue.dashboard.azureQueue')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <ServiceInstancesList snapshot={snapshot} />
    </>
  );
}
