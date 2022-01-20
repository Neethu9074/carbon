/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Table from 'in-sdk/components/dashboard/Table';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { bytes, number } from 'in-services/formatters/number';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

let snapshotMap = {};

const cols = [
  {
    title: t('in-phmc:id'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.genericVirtualAdapter.get('id');
      }
    }
  },
  {
    title: t('in-phmc:type'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.genericVirtualAdapter.get('type');
      }
    }
  },
  {
    title: t('in-phmc:viosId'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.genericVirtualAdapter.get('viosId');
      },
      getContent: number.detailed
    }
  },
  {
    title: t('in-phmc:physicalLocation'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.genericVirtualAdapter.get('physicalLocation');
      }
    }
  },
  {
    title: t('in-phmc:reads'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.genericVirtualAdapter.get('numOfReads');
      },
      getContent: number.detailed
    }
  },
  {
    title: t('in-phmc:writes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.genericVirtualAdapter.get('numOfWrites');
      },
      getContent: number.detailed
    }
  },
  {
    title: t('in-phmc:readBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.genericVirtualAdapter.get('readBytes');
      },
      getContent: bytes.compact
    }
  },
  {
    title: t('in-phmc:writeBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.genericVirtualAdapter.get('writeBytes');
      },
      getContent: bytes.compact
    }
  },
  {
    title: t('in-phmc:transmittedBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.genericVirtualAdapter.get('transmittedBytes');
      },
      getContent: bytes.compact
    }
  }
];


export default connectTo(
  (props) => {
    snapshotMap = props;
    // console.log('timeConfig' , timeConfig);
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'genericVirtualAdapters')
    };
  },
  function GenericVirtualLpars({ data }) {

    if (!data) {
      return null;
    }

    const { snapshotId, timeConfig } = snapshotMap;
    const virtual = data.get('raw_payload', []);
    const rows = virtual
      .keySeq()
      .toArray()
      .map(key => {
        const genericVirtualAdapter = virtual.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          genericVirtualAdapter
        };
      });
  
    const getDetails = (row) => {
 
      if(!snapshotMap?.timeConfig){
         return;
      }
      
        return (
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number,
              metrics: [
               'genericVirtualAdapters.' + row.key + '.numOfReads', 
               'genericVirtualAdapters.' + row.key + '.numOfWrites', 
               'genericVirtualAdapters.' + row.key + '.readBytes',
               'genericVirtualAdapters.' + row.key + '.writeBytes',
               'genericVirtualAdapters.' + row.key + '.transmittedBytes'
               ],
              labels: [
                  'Number of Reads',
                  'Number of Writes',
                  'Bytes Read',
                  'Bytes Write',
                  'Bytes Transmitted'
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
        cardTitle={t('in-phmc:dashboards.genericVirtualAdapter')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
        getRowDetails={getDetails}
      />
    );
  }
);

