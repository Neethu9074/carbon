/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { bytesTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import { formatDateTime, fromNowAccurately } from 'in-services/formatters/date';
import { isWindows, isZos } from 'in-forge/plugins/remoteHost/hostUtils';
import { t } from 'in-i18n';

export default function HardwareInfo({ snapshot }) {
  const data = snapshot.get('data');
  const memoryTotal = data.get('memory.total');
  const start = data.get('start');
  const openFilesMax = data.get('openFiles.max');
  const cpumodal = data.get('cpu.model') != null ? 'x' + data.get('cpu.model') : data.get('cpu.model');
  const osarch = data.get('os.arch') ? '(' + data.get('os.arch') + ')' : data.get('os.arch');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.host.os')}>
        {data.get('os.name')} {data.get('os.version')} {osarch}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.host.distribution')}>{data.get('os.dist')}</DescriptionItem>

      <DescriptionItem title={t('in-forge:plugins.host.cpu')}>
        {data.get('cpu.count')}
        {cpumodal}
      </DescriptionItem>

      {data.get('gpu.count') && (
        <DescriptionItem title={t('in-forge:plugins.host.gpu')}>
          {data.get('gpu.count')} x {data.get('gpu.model')}
        </DescriptionItem>
      )}

      {memoryTotal && (
        <DescriptionItem title={t('in-forge:plugins.host.memory')}>
          {bytesTwoDecimalPlaces(memoryTotal)}
        </DescriptionItem>
      )}

      {!(isWindows(snapshot) || isZos(snapshot)) && openFilesMax && (
        <DescriptionItem title={t('in-forge:plugins.host.maxOpenFiles')}>
          {zeroDecimalPlaces(openFilesMax)}
        </DescriptionItem>
      )}

      <DescriptionItem title={t('in-forge:plugins.host.hostname')}>{data.get('hostname')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.host.fqdn')}>{data.get('fqdn')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.host.machineId')}>{data.get('machineId')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.host.bootId')}>{data.get('bootId')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.host.systemId')}>{data.get('systemSerialNumber')}</DescriptionItem>

      {start && (
        <DescriptionItem title={t('in-forge:plugins.host.startedAt')}>
          {formatDateTime(start)} ({fromNowAccurately(start)})
        </DescriptionItem>
      )}
      <DescriptionItem title={t('in-forge:plugins.remoteHost.source')}>{data.get('source')}</DescriptionItem>
    </DescriptionList>
  );
}
