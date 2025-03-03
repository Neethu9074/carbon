/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { DashboardTable } from 'in-plg/components/DashboardTable/DashboardTable';

//test for DashboardTable component
describe('DashboardTable', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      }))
    });
  });

  it('Test table when rows are empty', () => {
    const headers = [
      {
        header: 'Name',
        key: 'name'
      },
      {
        header: 'Protocol',
        key: 'protocol'
      },
      {
        header: 'Port',
        key: 'port'
      },
      {
        header: 'Rule',
        key: 'rule'
      },
      {
        header: 'Attached groups',
        key: 'attached_groups'
      },
      {
        header: 'Status',
        key: 'status'
      }
    ];

    const hasAddmore = true;
    const viewLabel = true;
    render(
      <DashboardTable
        rows={[]}
        headers={headers}
        viewLabel="View All"
        hasAddMore={hasAddmore}
        hasAddPermission
        hasNoDataTile
        viewAll={viewLabel}
        noDataHeader="no datas in this tile"
      />
    );
    //test for table headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Protocol')).toBeInTheDocument();
    expect(screen.getByText('Port')).toBeInTheDocument();
    expect(screen.getByText('Rule')).toBeInTheDocument();
    expect(screen.getByText('Attached groups')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });
});
