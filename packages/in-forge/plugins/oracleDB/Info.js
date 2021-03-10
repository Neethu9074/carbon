/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function OracleDBInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.oracleDB.version')}>{data.get('version')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oracleDB.oracleSid')}>{data.get('databaseSID')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oracleDB.port')}>{data.get('port')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title={t('in-forge:plugins.oracleDB.cpuCount')}>{data.get('cpuCount')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oracleDB.maxSessions')}>{data.get('maxSessions')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oracleDB.dbBlockSize')}>{data.get('dbBlockSize')}</DescriptionItem>
    </DescriptionList>
  );
}
