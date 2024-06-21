/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Collapsible, DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function JbossDataGridInfo({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <Collapsible initiallyOpen>
      <Collapsible.Header>{t('in-forge:plugins.jbossDataGrid.jBossDataGridInfo')}</Collapsible.Header>
      <Collapsible.Content>
        <DescriptionList>
          <DescriptionItem title={t('in-forge:plugins.jbossDataGrid.jBossDataGridVersion')}>
            {data.get('version')}
          </DescriptionItem>
          <DescriptionItem title={t('in-forge:plugins.jbossDataGrid.jGroupsVersion')}>
            {data.get('jGroupsVersion')}
          </DescriptionItem>
          <DescriptionItem title={t('in-forge:plugins.jbossDataGrid.hotRodMaxWorkerThreads')}>
            {data.get('hotRod.numberOfWorkerThreads')}
          </DescriptionItem>
        </DescriptionList>
      </Collapsible.Content>
    </Collapsible>
  );
}
