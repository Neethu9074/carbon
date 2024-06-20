/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionItem, DescriptionList } from '@instana/components';

import { yesOrNo } from 'in-services/formatters/boolean';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.pingDirectory.version')}>{data.get('full_version')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.pingDirectory.revision')}>{data.get('revision')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.pingDirectory.state')}>{data.get('server_state')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.pingDirectory.masterServer')}>
        {yesOrNo(data.get('is_master_server'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.pingDirectory.unsynchronized')}>
        {yesOrNo(data.get('is_out_of_sync'))}
      </DescriptionItem>
    </DescriptionList>
  );
}
