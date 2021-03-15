/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import PhpSnapshot from 'in-forge/plugins/phpRuntimePlatform/PhpSnapshot.js';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { formatDateTime } from 'in-services/formatters/date';
import { t } from 'in-i18n';
import Info from '../Info';

export default function PhpFpmDashboardSidebar({ snapshot }) {
  const data = snapshot.get('data');
  const pools = data.get('worker_pools').toArray();

  return (
    <div>
      <PhpSnapshot snapshotId={snapshot.get('id')} initiallyOpen />

      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.phpFpmRuntimePlatform.dashboard.phpFpmRuntime')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />

          <KeyValueOverlay
            header={t('in-forge:plugins.phpFpmRuntimePlatform.dashboard.masterConfiguration')}
            data={data.filter((v, k) => k.indexOf('worker_pool') === -1)}
          />
        </Collapsible.Content>
      </Collapsible>

      {pools.map(pool => (
        <div key={pool}>
          <Collapsible initiallyOpen={false} key={pool}>
            <Collapsible.Header>Worker Pool: {pool}</Collapsible.Header>
            <Collapsible.Content>
              <DescriptionList>
                {data.get('worker_pool.' + pool + '.start_time') ? (
                  <DescriptionItem title={t('in-forge:plugins.phpFpmRuntimePlatform.dashboard.startTime')}>
                    {formatDateTime(data.get('worker_pool.' + pool + '.start_time') * 1000)}
                  </DescriptionItem>
                ) : null}
                <DescriptionItem title={t('in-forge:plugins.phpFpmRuntimePlatform.dashboard.processManager')}>
                  {data.get('worker_pool.' + pool + '.pm')}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.phpFpmRuntimePlatform.dashboard.statusPath')}>
                  {data.get('worker_pool.' + pool + '.pm_status_path')}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.phpFpmRuntimePlatform.dashboard.pingPath')}>
                  {data.get('worker_pool.' + pool + '.ping_path')}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.phpFpmRuntimePlatform.dashboard.user')}>
                  {data.get('worker_pool.' + pool + '.user')}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.phpFpmRuntimePlatform.dashboard.group')}>
                  {data.get('worker_pool.' + pool + '.group')}
                </DescriptionItem>
              </DescriptionList>

              <KeyValueOverlay
                header={t('in-forge:plugins.phpFpmRuntimePlatform.dashboard.workerPoolConfiguration', {
                  pool: pool
                })}
                data={data
                  .filter((v, k) => k.indexOf('worker_pool.' + pool) === 0)
                  .mapKeys(k => k.split('worker_pool.' + pool + '.')[1])}
              />
            </Collapsible.Content>
          </Collapsible>
        </div>
      ))}

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
