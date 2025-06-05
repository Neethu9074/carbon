/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';
import { DescriptionList, DescriptionItem } from '@instana/components';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function Info({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.maprNode.nodeName')}>{data.get('nodeName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.maprNode.pid')}>{data.get('pid')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.maprNode.rackTopology')}>{data.get('rackTopology')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.maprNode.configuredService')}>{data.get('configuredService')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.maprNode.health')}>{data.get('health')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.maprNode.healthDesc')}>{data.get('healthDesc')}</DescriptionItem>
    </DescriptionList>
  );
}
