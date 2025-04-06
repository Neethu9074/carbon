/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { cleanup, render } from '@testing-library/react';
import React from 'react';

import { DNSFilterTargetValue } from '@instana/types';

import { DNSAssertions } from 'in-synthetics/dashboards/summary/tabs/configuration/sections/DNSAssertions';

describe(DNSAssertions, () => {
  afterEach(() => {
    cleanup();
  });

  it('Render the Assertions section correctly', () => {
    const dummyAssertions: DNSFilterTargetValue[] = [
      { key: 'A', operator: 'CONTAINS', value: '8.8.8.8' },
      { key: 'CNAME', operator: 'MATCHES', value: 'test' }
    ];

    const { getByText } = render(<DNSAssertions assertions={dummyAssertions} />);
    expect(getByText('Assertions')).toBeInTheDocument();

    expect(document.querySelectorAll('.cds--css-grid')?.length).toBe(3);

    const headerGrid = document.querySelectorAll('.cds--css-grid')[0];
    const firstGrid = document.querySelectorAll('.cds--css-grid')[1];
    const secondGrid = document.querySelectorAll('.cds--css-grid')[2];

    expect(headerGrid.querySelectorAll('.cds--css-grid-column')[0]).toHaveTextContent('Record type');
    expect(headerGrid.querySelectorAll('.cds--css-grid-column')[1]).toHaveTextContent('Conditional');
    expect(headerGrid.querySelectorAll('.cds--css-grid-column')[2]).toHaveTextContent('Resolution record');

    expect(firstGrid.querySelectorAll('.cds--css-grid-column')[0]).toHaveTextContent('A');
    expect(firstGrid.querySelectorAll('.cds--css-grid-column')[1]).toHaveTextContent('Contains');
    expect(firstGrid.querySelectorAll('.cds--css-grid-column')[2]).toHaveTextContent('8.8.8.8');

    expect(secondGrid.querySelectorAll('.cds--css-grid-column')[0]).toHaveTextContent('CNAME');
    expect(secondGrid.querySelectorAll('.cds--css-grid-column')[1]).toHaveTextContent('Matches');
    expect(secondGrid.querySelectorAll('.cds--css-grid-column')[2]).toHaveTextContent('test');
  });
});
