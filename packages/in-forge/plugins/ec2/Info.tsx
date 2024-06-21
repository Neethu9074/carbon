/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { Ec2Tags } from 'in-forge/plugins/ec2/Ec2Tags';
import { emptyMap } from 'in-services/fixedImmutables';
//@ts-expect-error
import EbsList from './EbsList';
import { t } from 'in-i18n';

export default function Info({ snapshot }: { snapshot: any }) {
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

      <Ec2Tags snapshotId={snapshot.get('id')} deprecatedTags={tags} />

      <EbsList snapshotId={snapshot.get('id')} />
    </div>
  );
}
