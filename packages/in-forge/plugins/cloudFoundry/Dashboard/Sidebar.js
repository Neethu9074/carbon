/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import GeneralInfo from '../GeneralInfo';
import { t } from 'in-i18n';
import Info from '../Info';

export default function CloudFoundrySidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.cloudFoundry.cloudFoundry')}</Collapsible.Header>
        <Collapsible.Content>
          <GeneralInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Collapsible>
        <Collapsible.Header>{t('in-forge:plugins.cloudFoundry.info')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
