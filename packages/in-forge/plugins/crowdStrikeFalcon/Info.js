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
    <div>
      <DescriptionList>
        <DescriptionItem title={t('in-forge:plugins.crowdStrikeFalcon.rfm-state')}>
          {data.get('rfm-state')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.crowdStrikeFalcon.rfm-reason')}>
          {data.get('rfm-reason')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.crowdStrikeFalcon.version')}>{data.get('version')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.crowdStrikeFalcon.aid')}>{data.get('aid')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.crowdStrikeFalcon.cid')}>{data.get('cid')}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
