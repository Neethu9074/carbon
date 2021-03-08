/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { emptyList } from 'in-services/fixedImmutables';

export default function WebSphereInfo({ snapshot }) {
  const data = snapshot.get('data');
  const webModules = snapshot.getIn(['data', 'webModules'], emptyList);
  const datasources = snapshot.getIn(['data', 'datasourceNames'], emptyList);

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.version')}>{data.get('version')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.nodeName')}>{data.get('nodeName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.serverName')}>{data.get('serverName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.cellName')}>{data.get('cellName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.state')}>{data.get('state')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.webModules')}>{webModules.size}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.datasources')}>{datasources.size}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
