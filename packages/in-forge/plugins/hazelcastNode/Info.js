/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { yesOrNo } from 'in-services/formatters/boolean';
import { t } from 'in-i18n';

function getVersionString(data) {
  const version = data.get('version');
  if (version == undefined) {
    return undefined;
  }
  const isEnterprise = data.get('isEnterprise');
  if (isEnterprise == undefined) {
    return version;
  }
  const versionType = isEnterprise == 1 ? 'EE' : 'OS';
  return version + ' (' + versionType + ')';
}

export default function HazelcastInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.hazelcastNode.nodeName')}>{data.get('instanceName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.hazelcastNode.nodeAddress')}>
        {data.get('instanceAddress')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.hazelcastNode.nodeUuid')}>{data.get('instanceUuid')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.hazelcastNode.groupName')}>{data.get('groupName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.hazelcastNode.clusterId')}>{data.get('clusterId')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.hazelcastNode.version')}>{getVersionString(data)}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.hazelcastNode.isLiteMember')}>
        {yesOrNo(data.get('isLiteMember'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.hazelcastNode.isLocalMemberSafe')}>
        {yesOrNo(data.get('isLocalMemberSafe'))}
      </DescriptionItem>
    </DescriptionList>
  );
}
