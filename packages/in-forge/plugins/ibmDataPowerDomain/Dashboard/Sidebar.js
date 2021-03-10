/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React, { Fragment } from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from '../Info';

export default function IbmDataPowerDomainSidebar({ snapshot }) {
  return (
    <Fragment>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.ibmDataPowerDomain.ibmDataPowerDomainInfo')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <ServiceInstancesList snapshot={snapshot} />
    </Fragment>
  );
}
