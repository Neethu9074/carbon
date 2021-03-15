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
    <div>
      <DescriptionList>
        <DescriptionItem title={t('in-forge:plugins.bizTalk.infoName')}>{data.get('app')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.bizTalk.infoGroup')}>{data.get('group')}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
