/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { t } from 'in-i18n';

export default function MarathonInfo({ snapshot }) {
  const marathon = snapshot.getIn(['data', 'Marathon']);
  if (!marathon || marathon.size === 0) {
    return null;
  }

  const labels = marathon.get('labels');

  return (
    <div>
      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>{t('in-forge:plugins.docker.marathon')}</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title={t('in-forge:plugins.docker.appId')}>{marathon.get('appId')}</DescriptionItem>
            <DescriptionItem title={t('in-forge:plugins.docker.appVersion')}>
              {marathon.get('appVersion')}
            </DescriptionItem>
            <DescriptionItem title={t('in-forge:plugins.docker.cpuResources')}>
              {marathon.get('cpuResources')}
            </DescriptionItem>
            <DescriptionItem title={t('in-forge:plugins.docker.memoryResources')}>
              {marathon.get('memoryResources') ? `${marathon.get('memoryResources')} MB` : null}
            </DescriptionItem>
            <DescriptionItem title={t('in-forge:plugins.docker.diskResources')}>
              {marathon.get('diskResources') ? `${marathon.get('diskResources')} MB` : null}
            </DescriptionItem>
          </DescriptionList>

          {labels && labels.size > 0 ? (
            <KeyValueOverlay header={t('in-forge:plugins.docker.marathonLabels')} data={labels} />
          ) : null}
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
