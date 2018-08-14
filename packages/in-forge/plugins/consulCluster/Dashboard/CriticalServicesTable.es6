import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Service ID',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Service Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.service.get('serviceName');
      }
    }
  },
  {
    title: 'Check ID',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.service.get('checkID');
      }
    }
  },
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.service.get('checkID');
      }
    }
  },
  {
    title: 'Status',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.service.get('status');
      }
    }
  },
  {
    title: 'Notes',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.service.get('notes');
      }
    }
  },
  {
    title: 'Output',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.service.get('Output');
      }
    }
  },
  {
    title: 'Node',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.service.get('node');
      }
    }
  }
];

export default function CriticalServicesTable({ snapshot }) {
  const criticalServices = (snapshot.getIn(['data', 'critical_services']) || emptyList).toArray();

  const rows = criticalServices.map(service => {
    return {
      key: service.get('serviceID'),
      service
    };
  });

  return (
    <DashboardSection title={`Critical Services (${rows.length})`}>
      <Table cols={cols} rows={rows} />
    </DashboardSection>
  );
}
