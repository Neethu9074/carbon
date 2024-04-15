/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Collapsible } from '@instana/components';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import HaInfo from '../HaInfo';
import { t } from 'in-i18n';
import Info from '../Info';

export default function IbmMqQueueManagerSidebar({ snapshot }) {
  return (
    <Fragment>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.ibmMqQueueManager.dashboard.ibmMqQueueManager')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <HaInfo snapshot={snapshot} />

      <ServiceInstancesList snapshot={snapshot} />
    </Fragment>
  );
}
