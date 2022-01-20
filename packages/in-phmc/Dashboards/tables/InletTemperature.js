/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

let snapshotMap = {};

const cols = [
  {
    title: t('in-phmc:entityId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.inletTemperature.get('entityId');
      }
    }
  },
  {
    title: t('in-phmc:entityInstance'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.inletTemperature.get('entityInstance')?.toString() ?? '';
      }
    }
  },
  {
    title: t('in-phmc:temperatureReading'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.inletTemperature.get('temperatureReading');
      },
      getContent: number.detailed
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'inletTemperatures')
    };
  },
  function InletTemperature({ data }) {
    if (!data) {
      return null;
    }

    const { snapshotId, timeConfig } = snapshotMap;
    const inlet = data.get('raw_payload', []);
    const rows = inlet
      .keySeq()
      .toArray()
      .map(key => {
        const inletTemperature = inlet.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          inletTemperature
        };
      });
    return (
      <Table
        withoutPadding
        cardTitle={t('in-phmc:dashboards.inletTemperatures')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
      />
    );
  }
);
