/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { supportsOpenFiles } from 'in-forge/plugins/host/hostUtils';
import ParentProcess from 'in-forge/plugins/process/ParentProcess';
import getHostSnapshotId from 'in-subscription/getHostSnapshotId';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  ({ snapshot }) => ({ hostSnapshot: getHostSnapshotId(snapshot).flatMap(getSnapshot) }),

  function ProcessInfo({ snapshot, hostSnapshot }) {
    const data = snapshot.get('data');
    const openFilesMax = data.get('openFiles.max');
    const snapshotId = snapshot.get('id');

    return (
      <DescriptionList>
        <DescriptionItem title={t('in-forge:plugins.process.executable')}>{data.get('exec')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.process.processId')}>{data.get('pid')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.process.inContainerId')}>
          {data.get('containerPid')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.process.containerId')}>{data.get('container')}</DescriptionItem>
        <ProcessStartedAtDescriptionItem snapshotId={snapshotId} />
        <DescriptionItem title={t('in-forge:plugins.process.user')}>{data.get('user')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.process.group')}>{data.get('group')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.process.job')}>{data.get('job')}</DescriptionItem>
        <ParentProcess snapshotId={snapshotId} />

        {hostSnapshot && supportsOpenFiles(hostSnapshot) && openFilesMax != null && (
          <DescriptionItem title={t('in-forge:plugins.process.maxOpenFiles')}>
            {zeroDecimalPlaces(openFilesMax)}
          </DescriptionItem>
        )}
      </DescriptionList>
    );
  }
);
