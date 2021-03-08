/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from 'in-forge/plugins/googleCloudSQL/Info';
import TagList from 'in-sdk/components/sidebar/TagList';
import { t } from 'in-i18n';

export default function GoogleCloudSQLSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.googleCloudSQL.dashboard.googleCloudSqlInfo')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <TagList snapshot={snapshot} />

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
