/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Collapsible } from '@instana/components';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import ConnectorsInfo from 'in-forge/plugins/activeMQ/ConnectorsInfo';
import Info from 'in-forge/plugins/activeMQ/Info';
import { t } from 'in-i18n';

export default function ActiveMQSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.activeMQ.brokerInfo')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>{t('in-forge:plugins.activeMQ.transportConnectorsInfo')}</Collapsible.Header>
        <Collapsible.Content>
          <ConnectorsInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
