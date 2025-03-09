/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function OTelLLMInfo({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.oTelVLLM.entityType')}>
        {data.get('resource.vllm.entity.type')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelVLLM.serviceName')}>
        {data.get('resource.server.name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelVLLM.instanceId')}>
        {data.get('resource.service.instance.id')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelVLLM.kind')}>{data.get('kind')}</DescriptionItem>
    </DescriptionList>
  );
}
