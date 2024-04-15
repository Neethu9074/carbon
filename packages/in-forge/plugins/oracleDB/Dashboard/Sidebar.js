/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Collapsible } from '@instana/components';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import InstanceInfo from './instance/InstanceInfo';
import RACInfo from './rac/RacInfo';
import { t } from 'in-i18n';

export default function OracleDBSidebar({ snapshot }) {
  const data = snapshot.get('data');
  if (data.get('enableRacMonitoring')) {
    return (
      <div>
        <Collapsible initiallyOpen>
          <Collapsible.Header>{t('in-forge:plugins.oracleDB.oracleRAC')}</Collapsible.Header>
          <Collapsible.Content>
            <RACInfo snapshot={snapshot} />
          </Collapsible.Content>
        </Collapsible>

        <ServiceInstancesList snapshot={snapshot} />
      </div>
    );
  }
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.oracleDB.oracleDb')}</Collapsible.Header>
        <Collapsible.Content>
          <InstanceInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
