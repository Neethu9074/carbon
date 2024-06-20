/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function HardwareInfo({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.otelHost.hostname')}>{data.get('hostname')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.otelHost.type')}>{data.get('type')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.otelHost.ostype')}>{data.get('ostype')}</DescriptionItem>
    </DescriptionList>
  );
}
