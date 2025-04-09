/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';

import { DNSRecordTable } from 'in-synthetics/dashboards/details/components/DNSRecordTable';

describe(DNSRecordTable, () => {
  const dummyDNSCustomMetrics = [
    {
      data: 'tp.47cf2c8c9-frontier.amazon.com',
      responseTime: 28.7455,
      name: 'www.amazon.com',
      type: 'CNAME',
      ttl: 30
    }
  ] as unknown as Record<string, string>[];
  afterEach(() => {
    cleanup();
  });

  it('Render DNSRecordTable component without any errors', () => {
    render(<DNSRecordTable records={dummyDNSCustomMetrics} />);
  });

  it('Render DNSRecordTable table without pagination for records count less than five', () => {
    const { container } = render(<DNSRecordTable records={dummyDNSCustomMetrics} />);

    expect(container.getElementsByClassName('cds--data-table')[0]).toBeInTheDocument();
    expect(container.getElementsByClassName('cds--pagination').length).toBe(0);
  });

  it('Render DNSRecordTable table with pagination for records count greater than five', () => {
    const dummyDNSCustomMetricsWithMoreElements = [
      {
        data: 'outer-global-dual.ibmcom-tls12.edgekey.net',
        responseTime: 28.7455,
        name: 'www.ibm.com',
        type: 'CNAME',
        ttl: 30
      },
      {
        data: 'e7817.dscx.akamaiedge.net',
        responseTime: 28.7455,
        name: 'outer-global-dual.ibmcom-tls12.edgekey.net',
        type: 'CNAME',
        ttl: 30
      },
      {
        data: 'e7817.dscx.akamaiedge.net',
        responseTime: 28.7455,
        name: 'outer-global-dual.ibmcom-tls12.edgekey.net',
        type: 'CNAME',
        ttl: 30
      },
      {
        data: 'outer-global-dual.ibmcom-tls12.edgekey.net',
        responseTime: 28.7455,
        name: 'www.ibm.com',
        type: 'CNAME',
        ttl: 30
      },
      {
        data: 'e7817.dscx.akamaiedge.net',
        responseTime: 28.7455,
        name: 'outer-global-dual.ibmcom-tls12.edgekey.net',
        type: 'CNAME',
        ttl: 30
      },
      {
        data: 'outer-global-dual.ibmcom-tls12.edgekey.net',
        responseTime: 28.7455,
        name: 'www.ibm.com',
        type: 'CNAME',
        ttl: 30
      },
      {
        data: 'e7817.dscx.akamaiedge.net',
        responseTime: 28.7455,
        name: 'outer-global-dual.ibmcom-tls12.edgekey.net',
        type: 'CNAME',
        ttl: 30
      }
    ] as unknown as Record<string, string>[];
    const { container } = render(<DNSRecordTable records={dummyDNSCustomMetricsWithMoreElements} />);

    expect(container.getElementsByClassName('cds--data-table')[0]).toBeInTheDocument();
    expect(container.getElementsByClassName('cds--pagination').length).toBe(1);
  });

  it('Render DNSRecordTable table correctly for zero records', () => {
    const { container } = render(<DNSRecordTable records={[]} />);

    const dnsRecordTable = container.getElementsByClassName('cds--data-table')[0];

    expect(dnsRecordTable).toBeInTheDocument();
    expect(dnsRecordTable.getElementsByTagName('tr')).toHaveLength(2);

    expect(dnsRecordTable.getElementsByTagName('th')).toHaveLength(3);
    expect(dnsRecordTable.getElementsByTagName('th')[0]).toHaveTextContent('Name');
    expect(dnsRecordTable.getElementsByTagName('th')[1]).toHaveTextContent('TTL');
    expect(dnsRecordTable.getElementsByTagName('th')[2]).toHaveTextContent('Data');

    expect(screen.getByText('No records found')).toBeVisible();
  });

  it('Render DNSRecordTable table correctly for one or more records', () => {
    const { container } = render(<DNSRecordTable records={dummyDNSCustomMetrics} />);

    const dnsRecordTable = container.getElementsByClassName('cds--data-table')[0];

    expect(dnsRecordTable).toBeInTheDocument();
    expect(dnsRecordTable.getElementsByTagName('tr')).toHaveLength(2);

    expect(dnsRecordTable.getElementsByTagName('th')).toHaveLength(3);
    expect(dnsRecordTable.getElementsByTagName('th')[0]).toHaveTextContent('Name');
    expect(dnsRecordTable.getElementsByTagName('th')[1]).toHaveTextContent('TTL');
    expect(dnsRecordTable.getElementsByTagName('th')[2]).toHaveTextContent('Data');

    expect(dnsRecordTable.getElementsByTagName('td')).toHaveLength(3);
    expect(dnsRecordTable.getElementsByTagName('td')[0]).toHaveTextContent('www.amazon.com');
    expect(dnsRecordTable.getElementsByTagName('td')[1]).toHaveTextContent('30');
    expect(dnsRecordTable.getElementsByTagName('td')[2]).toHaveTextContent('tp.47cf2c8c9-frontier.amazon.com');
  });
});
