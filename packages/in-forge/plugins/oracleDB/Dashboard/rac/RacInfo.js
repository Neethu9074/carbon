/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function OracleDBInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.oracleDB.version')}>{data.get('version')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oracleDB.serviceName')}>
        {data.get('databaseServiceName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oracleDB.port')}>{data.get('port')}</DescriptionItem>
    </DescriptionList>
  );
}
