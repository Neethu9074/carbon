/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import InstanceStatusLabel from 'in-forge/plugins/googleCloudSQL/InstanceStatusLabel';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.googleCloudSQL.status')}>
        <InstanceStatusLabel status={data.get('database.state')} />
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudSQL.databaseVersion')}>
        {data.get('databaseVersion')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudSQL.diskSize')}>
        {data.get('currentDiskSize')} GB
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudSQL.region')}>{data.get('region')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudSQL.zone')}>{data.get('gceZone')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudSQL.tier')}>{data.get('tier')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudSQL.instanceType')}>
        {data.get('instanceType')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudSQL.master')}>
        {data.get('masterInstanceName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudSQL.slaveIoRunning')}>
        {data.get('database.mysql.replication.slave_io_running')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudSQL.slaveSqlRunning')}>
        {data.get('database.mysql.replication.slave_sql_running')}
      </DescriptionItem>
    </DescriptionList>
  );
}
