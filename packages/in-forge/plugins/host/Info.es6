import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { bytesTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import { formatDateTime, fromNowAccurately } from 'in-services/formatters/date';
import { isWindows, isZos } from 'in-forge/plugins/host/hostUtils';

export default function HardwareInfo({ snapshot }) {
  const data = snapshot.get('data');
  const memoryTotal = data.get('memory.total');
  const start = data.get('start');
  const openFilesMax = data.get('openFiles.max');

  return (
    <DescriptionList>
      <DescriptionItem title="OS">
        {data.get('os.name')} {data.get('os.version')} ({data.get('os.arch')})
      </DescriptionItem>

      <DescriptionItem title="CPU">
        {data.get('cpu.count')} x {data.get('cpu.model')}
      </DescriptionItem>

      {memoryTotal != null ? (
        <DescriptionItem title="Memory">{bytesTwoDecimalPlaces(memoryTotal)}</DescriptionItem>
      ) : null}

      {!(isWindows(snapshot) || isZos(snapshot)) &&
        openFilesMax != null && (
          <DescriptionItem title="Max Open Files">{zeroDecimalPlaces(openFilesMax)}</DescriptionItem>
        )}

      <DescriptionItem title="Hostname">{data.get('hostname')}</DescriptionItem>

      <DescriptionItem title="FQDN">{data.get('fqdn')}</DescriptionItem>
      <DescriptionItem title="Machine ID">{data.get('machineId')}</DescriptionItem>
      <DescriptionItem title="Boot ID">{data.get('bootId')}</DescriptionItem>

      {start != null ? (
        <DescriptionItem title="Started At">
          {formatDateTime(start)} ({fromNowAccurately(start)})
        </DescriptionItem>
      ) : null}
    </DescriptionList>
  );
}
