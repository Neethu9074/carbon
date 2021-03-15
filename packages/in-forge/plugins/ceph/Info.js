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
      <DescriptionItem title={t('in-forge:plugins.ceph.infoProcessID')}>{data.get('pid')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ceph.infoClusterName')}>{data.get('cluster_name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ceph.infoVersion')}>{data.get('version')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ceph.infoFsid')}>{data.get('fsid')}</DescriptionItem>
    </DescriptionList>
  );
}
