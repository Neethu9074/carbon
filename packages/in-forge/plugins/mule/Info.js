/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { yesOrNo } from 'in-services/formatters/boolean';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <Collapsible initiallyOpen>
      <Collapsible.Header>{t('in-forge:plugins.mule.info')}</Collapsible.Header>
      <Collapsible.Content>
        <DescriptionList>
          <DescriptionItem title={t('in-forge:plugins.mule.processId')}>{data.get('pid')}</DescriptionItem>
          <DescriptionItem title={t('in-forge:plugins.mule.version')}>{data.get('version')}</DescriptionItem>
          <DescriptionItem title={t('in-forge:plugins.mule.startTime')}>{data.get('startTime')}</DescriptionItem>
          <DescriptionItem title={t('in-forge:plugins.mule.initialised')}>
            {yesOrNo(data.get('initialised'))}
          </DescriptionItem>
        </DescriptionList>
      </Collapsible.Content>
    </Collapsible>
  );
}
