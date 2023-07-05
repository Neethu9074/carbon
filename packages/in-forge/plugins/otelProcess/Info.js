/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import OtelParentProcess from 'in-forge/plugins/otelProcess/OtelParentProcess';
import getHostSnapshotId from 'in-subscription/getHostSnapshotId';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  ({ snapshot }) => ({ hostSnapshot: getHostSnapshotId(snapshot).flatMap(getSnapshot) }),

  function ProcessInfo({ snapshot, hostSnapshot }) {
    if (!hostSnapshot) {
      return null;
    }
    const data = snapshot.get('data');
    const snapshotId = snapshot.get('id');

    return (
      <DescriptionList>
        <DescriptionItem title={t('in-forge:plugins.otelProcess.type')}>{data.get('type')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.otelProcess.PID')}>{data.get('pid')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.otelProcess.parentPID')}>{data.get('ppid')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.otelProcess.executableName')}>
          {data.get('executable_name')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.otelProcess.executablePath')}>
          {data.get('executable_path')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.otelProcess.command')}>{data.get('command')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.otelProcess.commandLine')}>
          {data.get('command_line')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.otelProcess.processUser')}>{data.get('owner')}</DescriptionItem>
        <ProcessStartedAtDescriptionItem snapshotId={snapshotId} />
        <OtelParentProcess snapshotId={snapshotId} />
      </DescriptionList>
    );
  }
);
