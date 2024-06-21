/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { fromNowAccurately } from 'in-services/formatters/date';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function Info({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.tibcoBWAppNode.pid')}>{data.get('pid')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.tibcoBWAppNode.appnodeName')}>{data.get('appnode')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.tibcoBWAppNode.appspace')}>{data.get('appspace')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.tibcoBWAppNode.domainName')}>{data.get('domainName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.tibcoBWAppNode.bwhome')}>{data.get('bwhome')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.tibcoBWAppNode.uptime')}>{fromNowAccurately(data.get('uptime'))}</DescriptionItem>
    </DescriptionList>
  );
}
