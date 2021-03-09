/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import { emptyMap } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

import EbsList from './EbsList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  const tags = data.get('tags', emptyMap);

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title={t('in-forge:plugins.ec2.publicHostname')}>
          {data.get('public-hostname')}
        </DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.ec2.instanceId')}>{data.get('instance-id')}</DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.ec2.type')}>{data.get('instance-type')}</DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.ec2.availabilityZone')}>
          {data.get('availability-zone')}
        </DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.ec2.publicIp')}>{data.get('public-ipv4')}</DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.ec2.amiId')}>{data.get('ami-id')}</DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.ec2.reservationId')}>{data.get('reservation-id')}</DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.ec2.securityGroups')}>
          {data.get('security-groups', []).join(', ')}
        </DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.ec2.publicKeys')}>
          {data.get('public-keys', []).join(', ')}
        </DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.ec2.vpc')}>{data.get('vpc-ids', []).join(', ')}</DescriptionItem>
      </DescriptionList>

      {tags.size > 0 && <KeyValueOverlay header={t('in-forge:plugins.ec2.tags')} data={tags} />}

      <EbsList snapshotId={snapshot.get('id')} />
    </div>
  );
}
