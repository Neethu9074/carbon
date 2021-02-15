/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import getSnapshotFromHierarchyByPlugin from 'in-sdk/components/hoc/getSnapshotFromHierarchyByPlugin';
import { formatDateTime, fromNowAccurately } from 'in-services/formatters/date';
import { DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';


export default getSnapshotFromHierarchyByPlugin(plugins.process, function ProcessStartedAtDescriptionItem({
  processSnapshot
}) {
  if (!processSnapshot) {
    return null;
  }

  const start = processSnapshot.getIn(['data', 'start']);
  if (!start) {
    return null;
  }

  return (
    <DescriptionItem title={t('in-sdk:sidebar.processStartedTitle')}>
      {formatDateTime(start)} ({fromNowAccurately(start)})
    </DescriptionItem>
  );
});
