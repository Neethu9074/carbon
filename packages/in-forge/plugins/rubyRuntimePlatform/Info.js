/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { emptyArray } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

export default function RubyInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.rubyRuntimePlatform.rubyVersion')}>
        {data.get('ruby_version')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.rubyRuntimePlatform.rubyPatchLevel')}>
        {data.get('rpl')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.rubyRuntimePlatform.runtimeArguments')}>
        {data.get('exec_args', emptyArray).join(' ')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.rubyRuntimePlatform.framework')}>
        {data.get('framework')}
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title={t('in-forge:plugins.rubyRuntimePlatform.processId')}>{data.get('pid')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.rubyRuntimePlatform.inProcessCollectorVersion')}>
        {data.get('sensorVersion')}
      </DescriptionItem>
    </DescriptionList>
  );
}
