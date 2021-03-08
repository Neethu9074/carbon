/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { t } from 'in-i18n';
import Info from '../Info';

export default function GcpDatastoreSidebar({ snapshot }) {
  return (
    <Fragment>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.googleCloudDatastore.dashboard.projectInfo')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <ServiceInstancesList snapshot={snapshot} />
    </Fragment>
  );
}
