/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { yesOrNo } from 'in-services/formatters/boolean';
import { emptyMap } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

export default function JbossDataGridCaches({ snapshot }) {
  const data = snapshot.get('data');
  const caches = data.get('caches', emptyMap);

  return (
    <div>
      {caches
        .map((cache, cacheName) => (
          <Collapsible initiallyOpen={false} key={cacheName}>
            <Collapsible.Header>
              {t('in-forge:plugins.jbossDataGrid.cacheName', { cacheName: cacheName })}
            </Collapsible.Header>
            <Collapsible.Content>
              <DescriptionList>
                <DescriptionItem title={t('in-forge:plugins.jbossDataGrid.status')}>
                  {cache.get('status')}
                </DescriptionItem>
                <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
                <DescriptionItem title={t('in-forge:plugins.jbossDataGrid.clusterName')}>
                  {cache.get('clusterName')}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.jbossDataGrid.statisticsEnabled')}>
                  {yesOrNo(cache.get('statisticsEnabled'))}
                </DescriptionItem>
              </DescriptionList>
              <KeyValueOverlay
                header={t('in-forge:plugins.jbossDataGrid.configuration')}
                data={cache.get('configuration')}
              />
            </Collapsible.Content>
          </Collapsible>
        ))
        .valueSeq()
        .toArray()}
    </div>
  );
}
