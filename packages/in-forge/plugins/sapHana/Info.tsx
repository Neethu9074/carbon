/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

// @ts-expect-error needs TS migration
import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function Info({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.sapHana.dashboard.host')}>{data.get('hostName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sapHana.port')}>{data.get('port')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sapHana.hostActiveStatus')}>
        {data.get('hostActiveStatus')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sapHana.upTime')}>{data.get('upTime')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sapHana.systemId')}>{data.get('instanceId')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sapHana.databaseName')}>{data.get('name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sapHana.instanceNumber')}>
        {data.get('instanceNumber')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sapHana.version')}>{data.get('version')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sapHana.installTime')}>{data.get('installTime')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sapHana.usage')}>{data.get('usage')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sapHana.distributed')}>{data.get('distributed')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sapHana.allServicesStarted')}>
        {data.get('allServicesStarted')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sapHana.maximumNumberOfSessions')}>
        {data.get('maxNumberOfSessions')}
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
