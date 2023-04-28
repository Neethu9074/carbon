/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { combineLatest, just } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Result } from '@instana/types';

import getIbmDataPowerXmlNamesForDomain from '../subscriptions/getIbmDataPowerXmlNamesForDomain';
import { getSnapshot, SnapshotData } from 'in-stores/snapshot/snapshot';
import { number, percentage } from 'in-services/formatters/number';
import { pendingResult } from 'in-services/fixedObjects';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { success } from 'in-services/util/result';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmDataPowerXmlName.type'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'type']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmDataPowerXmlName.used'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.key;
      },
      getMetricName() {
        return 'used';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmDataPowerXmlName.percentFree'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.key;
      },
      getMetricName() {
        return 'percentFree';
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmDataPowerXmlName.maximum'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.key;
      },
      getMetricName() {
        return 'maximum';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function GetXmlNames({ snapshot }: { snapshot: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = snapshot.get('id') as string;
  const xmlNames = useObservable(
    getIbmDataPowerXmlNamesForDomain({ snapshotId, timeConfig: timeConfig }).flatMap(result =>
      result.data
        ? combineLatest(result.data.map(xmlName => getSnapshot(xmlName, timeConfig))).map(xmlNames => success(xmlNames))
        : just(pendingResult as Result<SnapshotData[]>)
    ),
    [snapshotId, timeConfig]
  );

  if (!xmlNames?.data) {
    return null;
  }

  const rows =
    xmlNames.data.map(xmlName => ({
      key: xmlName.get('id'),
      snapshot: xmlName,
      timeConfig
    })) || [];

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.ibmDataPowerXmlName.xmlNamesNumber', { len: rows.length })}
      cols={cols}
      rows={rows}
    />
  );
}
