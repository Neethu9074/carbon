/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import AppInfo from '../AppInfo';
import { t } from 'in-i18n';
import Info from '../Info';

export default function JvmRuntimeSidebar({ snapshot }) {
  const args = snapshot.getIn(['data', 'jvm.args']);

  return (
    <div>
      <AppInfo snapshot={snapshot} />

      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.jvmRuntimePlatform.jvm')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {args ? (
        <KeyValueOverlay header={t('in-forge:plugins.jvmRuntimePlatform.jvmArguments')} data={args} sort={false} />
      ) : null}

      <RunningComponentsList snapshotId={snapshot.get('id')} />
      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
