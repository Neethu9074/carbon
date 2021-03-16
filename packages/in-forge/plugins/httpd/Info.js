/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function HttpdInfo({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.httpd.processId')}>{data.get('pid')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.httpd.version')}>{data.get('version')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.httpd.architecture')}>{data.get('architecture')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title={t('in-forge:plugins.httpd.maxWorkers')}>{data.get('max_workers')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.httpd.mpm')}>{data.get('mpm')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.httpd.listen')}>{data.get('ports', []).join(', ')}</DescriptionItem>
    </DescriptionList>
  );
}
