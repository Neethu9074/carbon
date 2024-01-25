/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Fragment } from 'react';

// @ts-expect-error Module needs to be translated to TS
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
// @ts-expect-error Module needs to be translated to TS
import TagList from 'in-sdk/components/sidebar/TagList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from 'in-forge/plugins/azureServiceBusTopics/Info';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function AzureServiceBusTopicSidebar({ snapshot }: { snapshot: SnapshotData }) {
  return (
    <Fragment>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.azureServiceBusTopics.infoAzureServiceBusTopic')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <TagList snapshot={snapshot} />
      <ServiceInstancesList snapshot={snapshot} />
    </Fragment>
  );
}
