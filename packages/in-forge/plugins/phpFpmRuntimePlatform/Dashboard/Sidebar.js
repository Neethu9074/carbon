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

import Info from '../Info';

export default function PhpFpmDashboardSidebar({ snapshot }) {
  const data = snapshot.get('data');
  const pools = data.get('worker_pools').toArray();

  return (
    <div>
      <PhpSnapshot snapshotId={snapshot.get('id')} initiallyOpen />

      <Collapsible initiallyOpen>
        <Collapsible.Header>PHP-FPM Runtime</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />

          <KeyValueOverlay
            header="Master Configuration"
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
                  <DescriptionItem title="Start Time">
                    {formatDateTime(data.get('worker_pool.' + pool + '.start_time') * 1000)}
                  </DescriptionItem>
                ) : null}
                <DescriptionItem title="Process Manager">{data.get('worker_pool.' + pool + '.pm')}</DescriptionItem>
                <DescriptionItem title="Status Path">
                  {data.get('worker_pool.' + pool + '.pm_status_path')}
                </DescriptionItem>
                <DescriptionItem title="Ping Path">{data.get('worker_pool.' + pool + '.ping_path')}</DescriptionItem>
                <DescriptionItem title="User">{data.get('worker_pool.' + pool + '.user')}</DescriptionItem>
                <DescriptionItem title="Group">{data.get('worker_pool.' + pool + '.group')}</DescriptionItem>
              </DescriptionList>

              <KeyValueOverlay
                header={`Worker Pool Configuration: ${pool}`}
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
