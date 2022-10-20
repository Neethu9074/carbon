/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { number, percentage } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { getRawPayload } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-phmc:dashboards.id'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.sharedProcessorPool.get('id');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-phmc:dashboards.name'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sharedProcessorPool.get('name');
      }
    }
  },
  {
    title: t('in-phmc:assignedProc'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.sharedProcessorPool.get('assignedProcUnits');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-phmc:utilizedProc'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.sharedProcessorPool.get('utilizedProcUnitsPercentage');
      },
      getContent: percentage.detailed
    }
  },
  {
    title: t('in-phmc:availableProc'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.sharedProcessorPool.get('availableProcUnitsPercentage');
      },
      getContent: percentage.detailed
    }
  },
  {
    title: t('in-phmc:reservedProc'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.sharedProcessorPool.get('currentReservedProcessingUnits');
      },
      getContent: number.compact
    }
  }
];

export default connectTo(
  ({ snapshotId }) => {
    return {
      data: getRawPayload(snapshotId, 'sharedProcessorPools')
    };
  },
  function SharedProcessorPool({ data }) {
    if (!data) {
      return null;
    }
    const sharedProcessorPools = data.toArray();

    if (sharedProcessorPools.size === 0) {
      return null;
    }
    const rows = sharedProcessorPools.map((sharedProcessorPool, idx) => {
      return {
        key: String(idx),
        sharedProcessorPool
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-phmc:dashboards.sharedProcessorPool')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
      />
    );
  }
);
