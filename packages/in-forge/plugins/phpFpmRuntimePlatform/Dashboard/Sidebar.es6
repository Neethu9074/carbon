import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import KeyValuePopupButton from 'in-sdk/components/sidebar/KeyValuePopupButton';
import PhpSnapshot from 'in-forge/plugins/phpRuntimePlatform/PhpSnapshot.es6';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { formatDateTime } from 'in-services/formatters/date';
import Separator from 'in-sdk/components/sidebar/Separator';

import Info from '../Info';

export default function PhpFpmDashboardSidebar({ snapshot }) {
  const data = snapshot.get('data');
  const pools = data.get('worker_pools').toArray();

  return (
    <div>
      <PhpSnapshot snapshotId={snapshot.get('id')} initiallyOpen />
      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>PHP-FPM Runtime</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />

          <KeyValuePopupButton
            title="Master Configuration"
            data={data.filter((v, k) => k.indexOf('worker_pool') === -1)}
          >
            Show Configuration
          </KeyValuePopupButton>
        </Collapsible.Content>
      </Collapsible>

      {pools.map(pool => (
        <div key={pool}>
          <Separator />

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

              <KeyValuePopupButton
                title={`Worker Pool Configuration: ${pool}`}
                data={data
                  .filter((v, k) => k.indexOf('worker_pool.' + pool) === 0)
                  .mapKeys(k => k.split('worker_pool.' + pool + '.')[1])}
              >
                Show Configuration
              </KeyValuePopupButton>
            </Collapsible.Content>
          </Collapsible>
        </div>
      ))}
      <ServiceInstancesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
