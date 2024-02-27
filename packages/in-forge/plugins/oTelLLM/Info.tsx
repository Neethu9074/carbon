/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function OTelLLMInfo({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.oTelLLM.entityType')}>
        {data.get('resource.llm.entity.type')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelLLM.platform')}>
        {data.get('resource.llm.platform')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelLLM.address')}>
        {data.get('resource.server.address')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelLLM.port')}>{data.get('resource.server.port')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelLLM.serviceName')}>
        {data.get('resource.server.name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelLLM.instanceId')}>
        {data.get('resource.service.instance.id')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelLLM.kind')}>{data.get('kind')}</DescriptionItem>
    </DescriptionList>
  );
}
