/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import AppPoolList from '../AppPoolList.js';
import WebSiteList from '../WebSiteList.js';
import { t } from 'in-i18n';
import Info from '../Info';

export default function MsIISSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.msiis.internetInformationServer')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>{t('in-forge:plugins.msiis.webSites')}</Collapsible.Header>
        <Collapsible.Content>
          <WebSiteList snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>{t('in-forge:plugins.msiis.applicationPools')}</Collapsible.Header>
        <Collapsible.Content>
          <AppPoolList snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
