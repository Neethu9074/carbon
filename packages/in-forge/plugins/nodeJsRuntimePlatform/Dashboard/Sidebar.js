/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import TagList from 'in-sdk/components/sidebar/TagList';
import { t } from 'in-i18n';
import Info from '../Info';

export default function NodejsDashboardSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.nodeJsRuntimePlatform.nodeJs')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <TagList snapshot={snapshot} />

      <KeyValueOverlay
        header={t('in-forge:plugins.nodeJsRuntimePlatform.dependencies')}
        data={snapshot.getIn(['data', 'dependencies'])}
      />

      <KeyValueOverlay
        header={t('in-forge:plugins.nodeJsRuntimePlatform.runtimeVersions')}
        data={snapshot.getIn(['data', 'versions'])}
      />

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
