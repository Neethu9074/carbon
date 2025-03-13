/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { cleanup, render } from '@testing-library/react';
import React from 'react';

import { DNSConfiguration } from '@instana/types';

import { DNSAdditionalProperties } from 'in-synthetics/dashboards/summary/tabs/configuration/sections/DNSAdditionalProperties';

describe(DNSAdditionalProperties, () => {
  afterEach(() => {
    cleanup();
  });

  it('Render all the additional DNS properties correctly', () => {
    const dummyConfig: DNSConfiguration = {
      acceptCNAME: false,
      lookup: 'www.ibm.com',
      lookupServerName: false,
      markSyntheticCall: true,
      port: 53,
      queryTime: { key: 'responseTime', operator: 'LESS_THAN', value: 120 },
      queryType: 'ANY',
      recursiveLookups: true,
      retries: 0,
      retryInterval: 1,
      server: '8.8.8.8',
      serverRetries: 1,
      syntheticType: 'DNS',
      targetValues: [
        { key: 'A', operator: 'CONTAINS', value: '8.8.8.8' },
        { key: 'CNAME', operator: 'MATCHES', value: 'test' }
      ],
      timeout: '0m',
      transport: 'UDP'
    };

    render(<DNSAdditionalProperties configuration={dummyConfig} />);

    expect(document.querySelectorAll('.cds--css-grid')?.length).toBe(2);

    const firstGrid = document.querySelectorAll('.cds--css-grid')[0];
    const secondGrid = document.querySelectorAll('.cds--css-grid')[1];

    expect(
      firstGrid.querySelectorAll('.cds--css-grid-column')[0].querySelector('.cds--subgrid')?.children[0]
    ).toHaveTextContent('Recursive lookup :');
    expect(
      firstGrid.querySelectorAll('.cds--css-grid-column')[0].querySelector('.cds--subgrid')?.children[1]
    ).toHaveTextContent('On');

    expect(
      firstGrid.querySelectorAll('.cds--css-grid-column')[3].querySelector('.cds--subgrid')?.children[0]
    ).toHaveTextContent('Transport protocol :');
    expect(
      firstGrid.querySelectorAll('.cds--css-grid-column')[3].querySelector('.cds--subgrid')?.children[1]
    ).toHaveTextContent('UDP');

    expect(
      firstGrid.querySelectorAll('.cds--css-grid-column')[6].querySelector('.cds--subgrid')?.children[0]
    ).toHaveTextContent('Accept CNAME :');
    expect(
      firstGrid.querySelectorAll('.cds--css-grid-column')[6].querySelector('.cds--subgrid')?.children[1]
    ).toHaveTextContent('Off');

    expect(
      secondGrid.querySelectorAll('.cds--css-grid-column')[0].querySelector('.cds--subgrid')?.children[0]
    ).toHaveTextContent('Lookup server name :');
    expect(
      secondGrid.querySelectorAll('.cds--css-grid-column')[0].querySelector('.cds--subgrid')?.children[1]
    ).toHaveTextContent('Off');

    expect(
      secondGrid.querySelectorAll('.cds--css-grid-column')[3].querySelector('.cds--subgrid')?.children[0]
    ).toHaveTextContent('Server retries :');
    expect(
      secondGrid.querySelectorAll('.cds--css-grid-column')[3].querySelector('.cds--subgrid')?.children[1]
    ).toHaveTextContent('1');
  });
});
