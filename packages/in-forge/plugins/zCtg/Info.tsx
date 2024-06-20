/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function Info({ snapshot }: { snapshot: any }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.zCtg.hostName')}>{data.get('hostName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zCtg.originNode')}>
        {data.get('CICSTG_Region_Overview.origin_node')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zCtg.systemId')}>
        {data.get('CICSTG_Region_Overview.system_id')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zCtg.cicsTransactionGatewayName')}>
        {data.get('CICSTG_Region_Overview.cics_transaction_gateway_name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zCtg.cicsTgVersion')}>
        {data.get('CICSTG_Region_Overview.cics_tg_version')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zCtg.startTimeAndDate')}>
        {data.get('CICSTG_Region_Overview.start_time_and_date')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zCtg.tcpPortNumber')}>
        {data.get('CICSTG_Region_Overview.tcp_port_number')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zCtg.sslPortNumber')}>
        {data.get('CICSTG_Region_Overview.ssl_port_number')}
      </DescriptionItem>
    </DescriptionList>
  );
}
