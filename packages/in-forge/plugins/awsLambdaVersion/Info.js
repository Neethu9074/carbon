/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionItem, DescriptionList } from 'in-sdk/components/sidebar/DescriptionList';
import LambdaFunctionLink from 'in-forge/plugins/awsLambdaVersion/LambdaFunctionLink';
import { megaBytesZeroDecimalPlaces, seconds } from 'in-services/formatters/number';
import { formatDateTime } from 'in-services/formatters/date';
import { getRuntimeByKey } from 'in-sdk/snapshot/runtimes';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="ARN">{data.get('arn')}</DescriptionItem>
      <DescriptionItem title="Version">{data.get('version')}</DescriptionItem>
      <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
      <DescriptionItem title="Description">{data.get('description')}</DescriptionItem>
      <DescriptionItem title="Revision ID">{data.get('revision')}</DescriptionItem>
      <DescriptionItem title="Code Hash">{data.get('code_sha_256')}</DescriptionItem>
      {data.get('npmPackageName') && (
        <DescriptionItem title="Node.js Package Name">{data.get('npmPackageName')}</DescriptionItem>
      )}
      {data.get('npmPackageVersion') && (
        <DescriptionItem title="Node.js Package Version">{data.get('npmPackageVersion')}</DescriptionItem>
      )}
      {data.get('npmPackageDescription') && (
        <DescriptionItem title="Node.js Package Description">{data.get('npmPackageDescription')}</DescriptionItem>
      )}
      <DescriptionItem title="Runtime">{getRuntimeByKey(data.get('runtime')).label}</DescriptionItem>
      <DescriptionItem title="Handler">{data.get('handler')}</DescriptionItem>
      {data.get('timeout') != null && (
        <DescriptionItem title="Timeout">{seconds.fixedCompact(data.get('timeout'))}</DescriptionItem>
      )}
      {data.get('memory_size') != null && (
        <DescriptionItem title="Memory Size">{megaBytesZeroDecimalPlaces(data.get('memory_size'))}</DescriptionItem>
      )}
      {data.get('last_modified') != null && (
        <DescriptionItem title="Last Modified">{formatDateTime(data.get('last_modified'))}</DescriptionItem>
      )}
      <DescriptionItem title="Region">{data.get('aws_grouping_zone')}</DescriptionItem>
      <LambdaFunctionLink snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
