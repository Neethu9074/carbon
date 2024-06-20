/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { t } from 'in-i18n';

export default function OracleDBInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.oracleDB.version')}>{data.get('version')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oracleDB.oracleSid')}>{data.get('databaseSID')}</DescriptionItem>
      {data.get('enablePDBMonitoring') === true ? (
        <DescriptionItem title={t('in-forge:plugins.oracleDB.serviceName')}>
          {data.get('databaseServiceName')}
        </DescriptionItem>
      ) : (
        <DescriptionItem title={t('in-forge:plugins.oracleDB.serviceNames')}>
          {data.get('serviceNames')}
        </DescriptionItem>
      )}
      <DescriptionItem title={t('in-forge:plugins.oracleDB.port')}>{data.get('port')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title={t('in-forge:plugins.oracleDB.cpuCount')}>{data.get('cpuCount')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oracleDB.maxSessions')}>{data.get('maxSessions')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oracleDB.dbBlockSize')}>{data.get('dbBlockSize')}</DescriptionItem>
    </DescriptionList>
  );
}
