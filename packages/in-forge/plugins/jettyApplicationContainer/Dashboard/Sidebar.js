/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import JettyThreadsInfo from '../JettyThreadsInfo.js';
import JettyConnectors from '../JettyConnectors.js';
import JettyWebApps from '../JettyWebApps.js';
import Info from '../Info.js';
import { t } from 'in-i18n';

export default function JettySidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.jettyApplicationContainer.jettyServerInfo')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <JettyThreadsInfo snapshot={snapshot} />
      <JettyConnectors snapshot={snapshot} />
      <JettyWebApps snapshot={snapshot} />
      <RunningComponentsList snapshotId={snapshot.get('id')} />
      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
