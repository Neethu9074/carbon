/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { getRawPayload, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

let snapshotMap = {};

const cols = [
  {
    title: t('in-phmc:dashboards.id'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sharedProcessorPool.get('id')?.toString() ?? '';
      }
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
      getMetricName(row) {
        return 'sharedProcessorPools.' + row.key + '.assignedProcUnits';
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: t('in-phmc:utilizedProc'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.sharedProcessorPool.get('utilizedProcUnitsPercentage');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: t('in-phmc:availableProc'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.sharedProcessorPool.get('availableProcUnitsPercentage');
      },
      getContent: bytesTwoDecimalPlaces
    }
  }
];
export default connectTo(
  (props) => {
    snapshotMap = props;
    // console.log('timeConfig' , timeConfig);
    return {
      data2: getRawPayload(props.snapshotId, 'sharedProcessorPools'),
      data: getRawPayloadWithTimestamp(props.snapshotId, 'sharedProcessorPools')
    };
  },
  function SharedProcessorPool({ data, data2 }) {


    // if(data2){
    //   console.log('data2 ',data2);

    // }
    // if(data){

    //   data = data.get('raw_payload');
    //   //console.log('raw payload data ',data, 'typeof', typeof(data));

    // }

    if (!data) {
      return null;
    }

    const { snapshot, snapshotId, timeConfig } = snapshotMap;
    const sharedPool = data.get('raw_payload', []);
    const rows = sharedPool
      .keySeq()
      .toArray()
      .map(key => {
        const sharedProcessorPool = sharedPool.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          snapshot,
          sharedProcessorPool
        };
      });

      //console.log('rows ',rows);
    // const sharedProcessorPools = data.toArray();
    // if (sharedProcessorPools.size === 0) {
    //   return null;
    // }
    // const rows = sharedProcessorPools.map((sharedProcessorPool, idx) => {
    //   return {
    //     key: String(idx),
    //     sharedProcessorPool
    //   };
    // });

    const getDetails = (row) => {

      if(!snapshotMap?.timeConfig){
         return;
      }

         console.log('JSON ' ,JSON.stringify(row));

        return (
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number,
              //'sharedProcessorPools.' + row.key + '.assignedProcUnits'
              metrics: ['sharedProcessorPools.' + row.key + '.assignedProcUnits'],
              labels: ['assignedProcUnits'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        );
      }
    return (
      <Table
        withoutPadding
        cardTitle={t('in-phmc:dashboards.sharedProcessorPool')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
        getRowDetails={getDetails}
      />
    );
  }
);
