/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { bytesTwoDecimalPlaces, number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { getRawPayloadWithTimestamp} from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

let snapshotMap = {};

const cols = [
  {
    title: t('in-phmc:drc'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sriovAdapter.get('drcIndex');
      }
    }
  },
  {
    title: t('in-phmc:physicalPortId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sriovAdapter.get('id')?.toString() ?? '';
      }
    }
  },
  {
    title: t('in-phmc:physicalLocation'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sriovAdapter.get('physicalLocation');
      }
    }
  },
  {
    title: t('in-phmc:sentPackets'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.sriovAdapter.get('sentPackets');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: t('in-phmc:recievedPackets'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.sriovAdapter.get('receivedPackets');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: t('in-phmc:sentBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.sriovAdapter.get('sentBytes');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: t('in-phmc:recievedBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.sriovAdapter.get('receivedBytes');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: t('in-phmc:transferredBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.sriovAdapter.get('transferredBytes');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: t('in-phmc:errorIn'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.sriovAdapter.get('errorIn');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: t('in-phmc:errorOut'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.sriovAdapter.get('errorOut');
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
      data: getRawPayloadWithTimestamp(props.snapshotId, 'sriovAdapters')
    };
  },
  function SharedProcessorPool({ data }) {

    if (!data) {
      return null;
    }

    const { snapshotId, timeConfig } = snapshotMap;
    const sriov = data.get('raw_payload', []);
    const rows = sriov
      .keySeq()
      .toArray()
      .map(key => {
        const sriovAdapter = sriov.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          sriovAdapter
        };
      });
  
    const getDetails = (row) => {
 
      if(!snapshotMap?.timeConfig){
         return;
      }
      
         console.log('JSON ' ,JSON.stringify(row));
         console.log('Chart value ','sriovAdapters.' + row.key + '.sentPackets');
        
        return (
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number,
              //'sharedProcessorPools.' + row.key + '.assignedProcUnits'
              metrics: ['sriovAdapters.' + row.key + '.sentPackets', 'sriovAdapters.' + row.key + '.receivedPackets', 'sriovAdapters.' + row.key + '.sentBytes','sriovAdapters.' + row.key + '.receivedBytes'],
              labels: [
                  'Packet Sent',
                  'Packet Recieved',
                  'Bytes Sent',
                  'Bytes Recieved'
                  ],
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
