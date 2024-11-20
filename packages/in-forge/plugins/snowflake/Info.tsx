/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function Info({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.snowflake.accountLocator')}>
        {data.get('accountLocator')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.snowflake.organization')}>{data.get('organization')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.snowflake.region')}>{data.get('region')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.snowflake.version')}>{data.get('version')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.snowflake.accountName')}>{data.get('accountName')}</DescriptionItem>
    </DescriptionList>
  );
}
