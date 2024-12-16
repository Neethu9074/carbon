/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { DateTimeWithPeriodSinceDescriptionItem } from 'in-sdk/components/sidebar/DateTimeWithPeriodSinceDescriptionItem';
import { t } from 'in-i18n';

function getIsRootlessString(data) {
  let isRootless = data.get('rootless');
  if (isRootless != undefined) {
    isRootless = data.get('rootless') ? 'true' : 'false';
  }
  return isRootless;
}

export default function PodmanContainerInfo({ snapshot }) {
  const data = snapshot.get('data');
  const isRootless = getIsRootlessString(data);

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.podman.image')}>{data.get('Image')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.podman.command')}>{data.get('Command')}</DescriptionItem>
      <DateTimeWithPeriodSinceDescriptionItem
        title={t('in-forge:plugins.podman.createdAt')}
        dateTime={data.get('Created')}
      />
      <DateTimeWithPeriodSinceDescriptionItem
        title={t('in-forge:plugins.podman.startedAt')}
        dateTime={data.get('Started')}
      />
      <DescriptionItem title={t('in-forge:plugins.podman.containerId')}>{data.get('Id')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.podman.name')}>{data.get('Name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.podman.graphDriver')}>{data.get('GraphDriver')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.podman.networkMode')}>{data.get('NetworkMode')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.podman.restartCount')}>{data.get('RestartCount')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.podman.remoteSocketPath')}>
        {data.get('remoteSocket')}
      </DescriptionItem>
      {isRootless && (
        <DescriptionItem title={t('in-forge:plugins.podman.isPodmanRootless')}>
          {getIsRootlessString(data)}
        </DescriptionItem>
      )}
      <DescriptionItem title={t('in-forge:plugins.podman.podmanVersion')}>{data.get('Podman_Version')}</DescriptionItem>
    </DescriptionList>
  );
}
