/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { yesOrNo } from 'in-services/formatters/boolean';
import { emptyList } from 'in-services/fixedImmutables';

export default function JenkinsInfo({ snapshot }) {
  const data = snapshot.get('data');
  const totalJobs = data.get('jobNames', emptyList).toArray().length;
  const mode = data.get('mode');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.jenkins.name')}>{data.get('nodeName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.jenkins.description')}>{data.get('nodeDescription')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.jenkins.version')}>{data.get('version')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.jenkins.port')}>{data.get('port')}</DescriptionItem>
      {mode && <DescriptionItem title={t('in-forge:plugins.jenkins.mode')}>{mode.toLowerCase()}</DescriptionItem>}
      <DescriptionItem title={t('in-forge:plugins.jenkins.executors')}>{data.get('executors')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.jenkins.secureMode')}>
        {yesOrNo(data.get('useSecurity'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.jenkins.totalJobs')}>{totalJobs}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
