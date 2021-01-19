/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
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
      <DescriptionItem title="Distribution">{data.get('os.dist')}</DescriptionItem>

      <DescriptionItem title="CPU">
        {data.get('cpu.count')} x {data.get('cpu.model')}
      </DescriptionItem>

      {data.get('gpu.count') && (
        <DescriptionItem title="GPU">
          {data.get('gpu.count')} x {data.get('gpu.model')}
        </DescriptionItem>
      )}

      {memoryTotal && <DescriptionItem title="Memory">{bytesTwoDecimalPlaces(memoryTotal)}</DescriptionItem>}

      {!(isWindows(snapshot) || isZos(snapshot)) && openFilesMax && (
        <DescriptionItem title="Max Open Files">{zeroDecimalPlaces(openFilesMax)}</DescriptionItem>
      )}

      <DescriptionItem title="Hostname">{data.get('hostname')}</DescriptionItem>
      <DescriptionItem title="FQDN">{data.get('fqdn')}</DescriptionItem>
      <DescriptionItem title="Machine ID">{data.get('machineId')}</DescriptionItem>
      <DescriptionItem title="Boot ID">{data.get('bootId')}</DescriptionItem>

      {start && (
        <DescriptionItem title="Started At">
          {formatDateTime(start)} ({fromNowAccurately(start)})
        </DescriptionItem>
      )}
    </DescriptionList>
  );
}
