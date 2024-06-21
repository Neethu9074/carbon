/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function NomadInfo({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.nomadScheduler.processId')}>{data.get('pid')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.nomadScheduler.nomadVersion')}>
        {data.get('nomad_version')}
      </DescriptionItem>
    </DescriptionList>
  );
}
