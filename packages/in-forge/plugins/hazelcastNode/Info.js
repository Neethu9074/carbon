/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { yesOrNo } from 'in-services/formatters/boolean';

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
      <DescriptionItem title="Node Name">{data.get('instanceName')}</DescriptionItem>
      <DescriptionItem title="Node Address">{data.get('instanceAddress')}</DescriptionItem>
      <DescriptionItem title="Node UUID">{data.get('instanceUuid')}</DescriptionItem>
      <DescriptionItem title="Group Name">{data.get('groupName')}</DescriptionItem>
      <DescriptionItem title="Cluster Id">{data.get('clusterId')}</DescriptionItem>
      <DescriptionItem title="Version">{getVersionString(data)}</DescriptionItem>
      <DescriptionItem title="Is Lite Member">{yesOrNo(data.get('isLiteMember'))}</DescriptionItem>
      <DescriptionItem title="Is Local Member Safe">{yesOrNo(data.get('isLocalMemberSafe'))}</DescriptionItem>
    </DescriptionList>
  );
}
