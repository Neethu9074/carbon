/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { emptyList } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

export default function WebSphereInfo({ snapshot }) {
  const data = snapshot.get('data');
  const threadPools = snapshot.getIn(['data', 'threadPoolNames'], emptyList);
  const webModules = snapshot.getIn(['data', 'webModules'], emptyList);
  const datasources = snapshot.getIn(['data', 'datasourceNames'], emptyList);
  const ejbModules = snapshot.getIn(['data', 'ejbModules'], emptyList);

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.version')}>{data.get('version')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.nodeName')}>{data.get('nodeName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.serverName')}>{data.get('serverName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.cellName')}>{data.get('cellName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.state')}>{data.get('state')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.threadPools')}>{threadPools.size}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.webModules')}>{webModules.size}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.datasources')}>{datasources.size}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.ejbModules')}>{ejbModules.size}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
