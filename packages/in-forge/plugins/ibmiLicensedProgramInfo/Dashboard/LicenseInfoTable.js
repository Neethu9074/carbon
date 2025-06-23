/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmiLicensedProgramInfo.dashboard.tables.licenseInfo.productId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.licenseInfoStringData.get('productId');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiLicensedProgramInfo.dashboard.tables.licenseInfo.licenseTerm'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.licenseInfoStringData.get('licenseTerm');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiLicensedProgramInfo.dashboard.tables.licenseInfo.licenseExpiration'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.licenseInfoStringData.get('licenseExpiration');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiLicensedProgramInfo.dashboard.tables.licenseInfo.featureId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.licenseInfoStringData.get('featureId');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiLicensedProgramInfo.dashboard.tables.licenseInfo.installed'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.licenseInfoStringData.get('installed');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiLicensedProgramInfo.dashboard.tables.licenseInfo.productText'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.licenseInfoStringData.get('productText');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiLicensedProgramInfo.dashboard.tables.licenseInfo.daysToExpire'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `licenseInformationMetrics.${row.key}.daysToExpire`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => {
    const { snapshotId } = props;
    return {
      data: getRawPayloadWithTimestamp(snapshotId, 'licenseInformationRawPayload')
    };
  },
  function licenseInfoTable({ data, snapshotId, timeConfig }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const licenseInfoRawPayload = data.get('raw_payload');
    if (licenseInfoRawPayload.size === 0) {
      return null;
    }

    const rows = licenseInfoRawPayload
      .map((licenseInfoStringData, key) => {
        return {
          key,
          licenseInfoStringData,
          timeConfig,
          snapshotId
        };
      })
      .valueSeq()
      .toArray();

    return (
      <Table
        withoutPadding
        cardTitle={
          <TimeOfLastUpdateCardTitle
            title={t('in-forge:plugins.ibmiLicensedProgramInfo.dashboard.tables.licenseInfo.name')}
            timestamp={data.get('timestamp')}
          />
        }
        cols={cols}
        rows={rows}
        initialSortColumn={2}
        initialSortDirection="desc"
      />
    );
  }
);
