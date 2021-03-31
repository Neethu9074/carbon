/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function EnvoyInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.envoy.pid')}>{data.get('pid')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.envoy.version')}>{data.get('version')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.envoy.configFilePath')}>{data.get('configFilePath')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
