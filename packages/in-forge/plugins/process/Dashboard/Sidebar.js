/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { t } from 'in-i18n';
import Info from '../Info';

export default function ProcessSidebar({ snapshot }) {
  const args = snapshot.getIn(['data', 'args']);
  const env = snapshot.getIn(['data', 'env']);

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.process.dashboard.process')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {args && args.size > 0 ? (
        <KeyValueOverlay header={t('in-forge:plugins.process.dashboard.arguments')} data={args} sort={false} />
      ) : null}

      <KeyValueOverlay header={t('in-forge:plugins.process.dashboard.environmentVariables')} data={env} />
      <RunningComponentsList snapshotId={snapshot.get('id')} />
      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
