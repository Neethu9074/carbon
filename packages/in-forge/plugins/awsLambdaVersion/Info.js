/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Collapsible, DescriptionItem, DescriptionList } from '@instana/components';

import LambdaFunctionLink from 'in-forge/plugins/awsLambdaVersion/LambdaFunctionLink';
import { megaBytesZeroDecimalPlaces, seconds } from 'in-services/formatters/number';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import { formatDateTime } from 'in-services/formatters/date';
import { getRuntimeByKey } from 'in-sdk/snapshot/runtimes';
import List from 'in-sdk/components/sidebar/List';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  const layers = data.get('layers');
  const envVars = data.get('env_vars');

  return (
    <>
      <DescriptionList>
        <DescriptionItem title={t('in-forge:plugins.infoTitle.arn')}>{data.get('arn')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.infoTitle.version')}>{data.get('version')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.infoTitle.name')}>{data.get('name')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.infoTitle.description')}>{data.get('description')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.infoTitle.revisionID')}>{data.get('revision')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.infoTitle.codeHash')}>{data.get('code_sha_256')}</DescriptionItem>
        {data.get('npmPackageName') && (
          <DescriptionItem title={t('in-forge:plugins.infoTitle.nodejsPackageName')}>
            {data.get('npmPackageName')}
          </DescriptionItem>
        )}
        {data.get('npmPackageVersion') && (
          <DescriptionItem title={t('in-forge:plugins.infoTitle.nodejsPackageVersion')}>
            {data.get('npmPackageVersion')}
          </DescriptionItem>
        )}
        {data.get('npmPackageDescription') && (
          <DescriptionItem title={t('in-forge:plugins.infoTitle.nodejsPackageDescription')}>
            {data.get('npmPackageDescription')}
          </DescriptionItem>
        )}
        <DescriptionItem title={t('in-forge:plugins.infoTitle.runtime')}>
          {getRuntimeByKey(data.get('runtime')).label}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.infoTitle.handler')}>{data.get('handler')}</DescriptionItem>
        {data.get('timeout') != null && (
          <DescriptionItem title={t('in-forge:plugins.infoTitle.timeout')}>
            {seconds.fixedCompact(data.get('timeout'))}
          </DescriptionItem>
        )}
        {data.get('memory_size') != null && (
          <DescriptionItem title={t('in-forge:plugins.infoTitle.memorySize')}>
            {megaBytesZeroDecimalPlaces(data.get('memory_size'))}
          </DescriptionItem>
        )}
        {data.get('last_modified') != null && (
          <DescriptionItem title={t('in-forge:plugins.infoTitle.lastModified')}>
            {formatDateTime(data.get('last_modified'))}
          </DescriptionItem>
        )}
        <DescriptionItem title={t('in-forge:plugins.infoTitle.region')}>
          {data.get('aws_grouping_zone')}
        </DescriptionItem>
        <LambdaFunctionLink snapshotId={snapshot.get('id')} />
      </DescriptionList>
      {layers && layers.size > 0 ? (
        <Collapsible initiallyOpen>
          <Collapsible.Header>{t('in-forge:plugins.infoTitle.layers')}</Collapsible.Header>
          <Collapsible.Content>
            <List>
              {layers.toJS().map(layer => (
                <List.Item key={layer}>{layer}</List.Item>
              ))}
            </List>
          </Collapsible.Content>
        </Collapsible>
      ) : null}
      <KeyValueOverlay header={t('in-forge:plugins.process.dashboard.environmentVariables')} data={envVars} />
    </>
  );
}
