/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function PythonInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Name">{data.get('snapshot.name')}</DescriptionItem>
      <DescriptionItem title="Flavor">{data.get('snapshot.f')}</DescriptionItem>
      <DescriptionItem title="Runtime Version">{data.get('snapshot.version')}</DescriptionItem>
      <DescriptionItem title="Architecture">{data.get('snapshot.a')}</DescriptionItem>
      <DescriptionItem title="Process ID">{data.get('pid')}</DescriptionItem>
      <DescriptionItem title="Framework">{data.get('snapshot.fw')}</DescriptionItem>
      <DescriptionItem title="Activation Method">{data.get('snapshot.m')}</DescriptionItem>
      <DescriptionItem title="Instana Package Version">{data.get('snapshot.iv')}</DescriptionItem>
    </DescriptionList>
  );
}
