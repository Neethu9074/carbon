/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import DeployedUnitList from 'in-sdk/components/sidebar/DeployedUnitList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import TagList from 'in-sdk/components/sidebar/TagList';
import { t } from 'in-i18n';
import Info from '../Info';

export default function MariaDbSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.mariaDbDatabase.mariaDb')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <TagList snapshot={snapshot} />
      <DeployedUnitList snapshotId={snapshot.get('id')} />
      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
