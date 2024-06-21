/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function Backends({ snapshot, backend }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.host')}>
        {data.get('backends.' + backend + '.host')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.port')}>
        {data.get('backends.' + backend + '.port')}
      </DescriptionItem>
    </DescriptionList>
  );
}
