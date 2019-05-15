import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { isWindows, isZos } from 'in-forge/plugins/host/hostUtils';
import getHostSnapshotId from 'in-subscription/getHostSnapshotId';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ snapshot }) => ({ hostSnapshot: getHostSnapshotId(snapshot).flatMap(getSnapshot) }),

  function ProcessInfo({ snapshot, hostSnapshot }) {
    const data = snapshot.get('data');
    return (
      <DescriptionList>
        <DescriptionItem title="Executable">{data.get('exec')}</DescriptionItem>
        <DescriptionItem title="Process ID">{data.get('pid')}</DescriptionItem>
        <DescriptionItem title="In-Container ID">{data.get('containerPid')}</DescriptionItem>
        <DescriptionItem title="Container ID">{data.get('container')}</DescriptionItem>
        <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
        <DescriptionItem title="User">{data.get('user')}</DescriptionItem>
        <DescriptionItem title="Group">{data.get('group')}</DescriptionItem>
        <DescriptionItem title="Job">{data.get('job')}</DescriptionItem>

        {hostSnapshot && !(isWindows(hostSnapshot) || isZos(hostSnapshot)) ? (
          <DescriptionItem title="Max Open Files">{zeroDecimalPlaces(data.get('openFiles.max'))}</DescriptionItem>
        ) : null}
      </DescriptionList>
    );
  }
);
