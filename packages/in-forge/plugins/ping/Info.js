/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.ping.label')}>{data.get('label')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ping.type')}>{data.get('type')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ping.target')}>{data.get('target')}</DescriptionItem>
    </DescriptionList>
  );
}
