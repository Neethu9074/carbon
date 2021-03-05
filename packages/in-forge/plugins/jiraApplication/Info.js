/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import MetricValue from 'in-components/MetricValue';

export default function JiraInfo({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.jiraApplication.version')}>
        {snapshot.getIn(['data', 'version'])}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.jiraApplication.issues')}>
        <MetricValue metric={'instruments.entity.issues.total'} snapshotId={snapshotId} />
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.jiraApplication.workflows')}>
        <MetricValue metric={'instruments.entity.workflows.total'} snapshotId={snapshotId} />
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.jiraApplication.customFields')}>
        <MetricValue metric={'instruments.entity.customfields.total'} snapshotId={snapshotId} />
      </DescriptionItem>
    </DescriptionList>
  );
}
