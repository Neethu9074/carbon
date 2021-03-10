/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function ConfigInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.openLDAP.dn')}>{data.get('config.dn')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.openLDAP.cn')}>{data.get('config.cn')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.openLDAP.objectClass')}>
        {data.get('config.objectClass')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.openLDAP.olcArgsFile')}>
        {data.get('config.olcArgsFile')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.openLDAP.olcLogLevel')}>
        {data.get('config.olcLogLevel')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.openLDAP.olcPidFile')}>
        {data.get('config.olcPidFile')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.openLDAP.olcToolThreads')}>
        {data.get('config.olcToolThreads')}
      </DescriptionItem>
    </DescriptionList>
  );
}
