/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function Db2Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.db2ZDatabase.host')}>{data.get('host')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.db2ZDatabase.port')}>{data.get('port')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.db2ZDatabase.location')}>{data.get('location')}</DescriptionItem>
    </DescriptionList>
  );
}
