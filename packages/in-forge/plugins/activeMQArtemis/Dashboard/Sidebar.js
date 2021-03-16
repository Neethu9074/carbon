/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import AcceptorsInfo from 'in-forge/plugins/activeMQArtemis/AcceptorsInfo';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from 'in-forge/plugins/activeMQArtemis/Info';
import { t } from 'in-i18n';

export default function ActiveMQArtemisSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.activeMQArtemis.brokerInfo')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>{t('in-forge:plugins.activeMQArtemis.transportAcceptorsInfo')}</Collapsible.Header>
        <Collapsible.Content>
          <AcceptorsInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <KeyValueOverlay
        header={t('in-forge:plugins.activeMQArtemis.addresses')}
        data={snapshot.getIn(['data', 'addressNames'])}
      />
      <KeyValueOverlay
        header={t('in-forge:plugins.activeMQArtemis.queues')}
        data={snapshot.getIn(['data', 'queueNames'])}
      />
      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
