/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getIbmDataPowerEthernetInterfacesForAppliance from 'in-subscription/ibmDataPowerAppliance/getIbmDataPowerEthernetInterfacesForAppliance';
import { bytesTwoDecimalPlaces, number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmDataPowerAppliance.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmDataPowerAppliance.ipAddress'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.ethernetInterface.getIn(['data', 'ipAddress']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmDataPowerAppliance.operStatus'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.ethernetInterface.getIn(['data', 'operStatus']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmDataPowerAppliance.rxHCBytes'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return `rxHCBytes`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmDataPowerAppliance.txHCBytes'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return `txHCBytes`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmDataPowerAppliance.rxDrops'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return `rxDrops`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmDataPowerAppliance.txDrops'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },

      getMetricName() {
        return `txDrops`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => ({
    ethernetInterfaces: timeConfig$
      .flatMap(timeConfig =>
        getIbmDataPowerEthernetInterfacesForAppliance({ snapshotId: props.snapshot.get('id'), timeConfig })
      )
      .flatMap(getSnapshots)
  }),
  function EthernetInterfacesTable({ ethernetInterfaces, timeConfig }) {
    if (ethernetInterfaces == null || ethernetInterfaces.length === 0) {
      return null;
    }

    const rows = ethernetInterfaces.map(ethernetInterface => {
      return {
        key: ethernetInterface.get('id'),
        snapshotId: ethernetInterface.get('id'),
        ethernetInterface,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.ibmDataPowerAppliance.ethernetInterfacesNumber', { count: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
