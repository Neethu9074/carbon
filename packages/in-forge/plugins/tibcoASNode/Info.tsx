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
      <DescriptionItem title={t('in-forge:plugins.tibcoASNode.pid')}>{data.get('pid')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.tibcoASNode.nodeName')}>{data.get('nodeName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.tibcoASNode.gridName')}>{data.get('gridName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.tibcoASNode.copysetName')}>{data.get('copysetName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.tibcoASNode.version')}>{data.get('version')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.tibcoASNode.nodeType')}>{data.get('nodeType')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.tibcoASNode.dataDirectory')}>
        {data.get('dataDirectory')}
      </DescriptionItem>
    </DescriptionList>
  );
}
