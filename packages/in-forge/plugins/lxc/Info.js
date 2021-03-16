/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function LxcInfo({ snapshot }) {
  const data = snapshot.get('data');
  const privileged = '(' + (data.get('privileged') ? 'privileged' : 'unprivileged') + ')';

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.lxc.name')}>{data.get('name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.lxc.processId')}>{data.get('pid')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.lxc.state')}>{data.get('state') + ' ' + privileged}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.lxc.ip')}>{data.get('ip')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.lxc.networkInterface')}>
        {data.get('networkInterface')}
      </DescriptionItem>
    </DescriptionList>
  );
}
