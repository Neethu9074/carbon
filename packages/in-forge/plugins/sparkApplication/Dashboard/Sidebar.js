/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { t } from 'in-i18n';
import Info from '../Info';

export default function Sidebar({ snapshot }) {
  const conf = snapshot.getIn(['data', 'conf']);
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.sparkApplication.dashboard.sparkApplication')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <KeyValueOverlay header={t('in-forge:plugins.sparkApplication.dashboard.sparkConf')} data={conf} />

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
