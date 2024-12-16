/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.awsRds.database')}>{data.get('db_name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsRds.endpoint')}>{data.get('endpoint_address')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsRds.role')}>{data.get('role')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsRds.port')}>{data.get('endpoint_port')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsRds.hostedZone')}>
        {data.get('endpoint_hosted_zone_id')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsRds.masterUser')}>{data.get('master_user')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsRds.availabilityZone')}>
        {data.get('availability_zone')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsRds.arn')}>{data.get('db_instance_arn')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsRds.engine')}>{data.get('db_engine')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsRds.cluster')}>{data.get('db_cluster')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsRds.agentHost')}>{data.get('agent_host')}</DescriptionItem>
    </DescriptionList>
  );
}
