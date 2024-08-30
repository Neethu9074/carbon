/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Collapsible } from '@instana/components';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import { t } from 'in-i18n';
import Info from '../Info';

export default function RedisSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>
          {t('in-forge:plugins.redisEnterpriseShard.dashboard.redisEnterpriseShard')}
        </Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
