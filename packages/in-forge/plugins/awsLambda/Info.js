/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { megaBytesZeroDecimalPlaces, seconds } from 'in-services/formatters/number';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { formatDateTime } from 'in-services/formatters/date';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="ARN">{data.get('arn')}</DescriptionItem>
      <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
      <DescriptionItem title="Description">{data.get('description')}</DescriptionItem>
      <DescriptionItem title="Runtime">{data.get('runtime')}</DescriptionItem>
      <DescriptionItem title="Handler">{data.get('handler')}</DescriptionItem>
      <DescriptionItem title="Timeout">{seconds.fixedCompact(data.get('timeout'))}</DescriptionItem>
      <DescriptionItem title="Memory Size">{megaBytesZeroDecimalPlaces(data.get('memory_size'))}</DescriptionItem>
      <DescriptionItem title="Last Modified">{formatDateTime(data.get('last_modified'))}</DescriptionItem>
      <DescriptionItem title="Region">{data.get('aws_grouping_zone')}</DescriptionItem>
    </DescriptionList>
  );
}
