/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
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
    title: t('in-phmc:virtualSlotNumber'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.vnicDedicatedDetails.get('virtualSlotNumber');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-phmc:localPartitionID'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.vnicDedicatedDetails.get('localPartitionID');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-phmc:dynamicReconfig'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.vnicDedicatedDetails.get('dynamicReconfig');
      }
    }
  },
  {
    title: t('in-phmc:portVlanID'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.vnicDedicatedDetails.get('portVlanID');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-phmc:macAddress'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.vnicDedicatedDetails.get('macAddress');
      }
    }
  },
  {
    title: t('in-phmc:osDeviceName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.vnicDedicatedDetails.get('osDeviceName');
      }
    }
  },
  {
    title: t('in-phmc:desiredMode'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.vnicDedicatedDetails.get('desiredMode');
      }
    }
  },
  {
    title: t('in-phmc:lparName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.vnicDedicatedDetails.get('lparName');
      }
    }
  },
  {
    title: t('in-phmc:deviceType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.vnicDedicatedDetails.get('deviceType');
      }
    }
  },
  {
    title: t('in-phmc:status'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.vnicDedicatedDetails.get('status');
      }
    }
  },
  {
    title: t('in-phmc:failOverPriority'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.vnicDedicatedDetails.get('failOverPriority');
      },
      getContent: number.detailed
    }
  },
  {
    title: t('in-phmc:relatedSriovAdapterID'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.vnicDedicatedDetails.get('relatedSriovAdapterID');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-phmc:relatedSriovPhysicalPortID'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.vnicDedicatedDetails.get('relatedSriovPhysicalPortID');
      },
      getContent: number.compact
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'vnicDedicated')
    };
  },
  function VnicDedicatedAdapter({ data }) {
    if (!data) {
      return null;
    }

    const { snapshotId, timeConfig } = snapshotMap;
    const vnic = data.get('raw_payload', []);
    const rows = vnic
      .keySeq()
      .toArray()
      .map(key => {
        const vnicDedicatedDetails = vnic.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          vnicDedicatedDetails
        };
      });
    return (
      <Table
        withoutPadding
        cardTitle={t('in-phmc:dashboards.vnicDedicated')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
      />
    );
  }
);
