/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { bytesTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import { formatDateTime, fromNowAccurately } from 'in-services/formatters/date';
import { isWindows, isZos } from 'in-forge/plugins/host/hostUtils';
import { t } from 'in-i18n';

export default function HardwareInfo({ snapshot }) {
  const data = snapshot.get('data');
  const memoryTotal = data.get('memory.total');
  const start = data.get('start');
  const openFilesMax = data.get('openFiles.max');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.host.os')}>
        {data.get('os.name')} {data.get('os.version')} ({data.get('os.arch')})
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.host.distribution')}>{data.get('os.dist')}</DescriptionItem>

      <DescriptionItem title={t('in-forge:plugins.host.cpu')}>
        {data.get('cpu.count')} x {data.get('cpu.model')}
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
    </DescriptionList>
  );
}
