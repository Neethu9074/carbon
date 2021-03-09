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

export default function PythonDashboardSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Python</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <KeyValueOverlay
        header={t('in-forge:plugins.pythonRuntimePlatform.dashboard.loadedPackages')}
        data={snapshot.getIn(['data', 'snapshot.versions'])}
      />
      <KeyValueOverlay
        header={t('in-forge:plugins.pythonRuntimePlatform.dashboard.djangoMiddleware')}
        data={snapshot.getIn(['data', 'snapshot.djmw'])}
      />

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
