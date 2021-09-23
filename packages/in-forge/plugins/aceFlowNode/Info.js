/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.aceFlowNode.nodeName')}>{data.get('nodeName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aceFlowNode.flowName')}>{data.get('flowName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aceFlowNode.applicationName')}>
        {data.get('applicationName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aceFlowNode.serverName')}>{data.get('serverName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aceFlowNode.type')}>{data.get('type')}</DescriptionItem>
    </DescriptionList>
  );
}
