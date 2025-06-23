/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { cleanup, render } from '@testing-library/react';
import React from 'react';

import { SSLCertificateValidation } from '@instana/types';

import { SSLAssertions } from 'in-synthetics/dashboards/summary/tabs/configuration/sections/SSLAssertions';

describe(SSLAssertions, () => {
  afterEach(() => {
    cleanup();
  });

  it('Render the Assertions section correctly', () => {
    const dummyAssertions: SSLCertificateValidation[] = [
      { key: 'issuedTo.commonName', operator: 'CONTAINS', value: '8.8.8.8' },
      { key: 'issuedTo.alternativeName', operator: 'MATCHES', value: 'test' }
    ];

    const { getByText } = render(<SSLAssertions assertions={dummyAssertions} />);
    expect(getByText('Assertions')).toBeInTheDocument();

    expect(document.querySelectorAll('.cds--css-grid')?.length).toBe(3);

    const headerGrid = document.querySelectorAll('.cds--css-grid')[0];
    const firstGrid = document.querySelectorAll('.cds--css-grid')[1];
    const secondGrid = document.querySelectorAll('.cds--css-grid')[2];

    expect(headerGrid.querySelectorAll('.cds--css-grid-column')[0]).toHaveTextContent('Attribute');
    expect(headerGrid.querySelectorAll('.cds--css-grid-column')[1]).toHaveTextContent('Conditional');
    expect(headerGrid.querySelectorAll('.cds--css-grid-column')[2]).toHaveTextContent('Value');

    expect(firstGrid.querySelectorAll('.cds--css-grid-column')[0]).toHaveTextContent('issuedTo.commonName');
    expect(firstGrid.querySelectorAll('.cds--css-grid-column')[1]).toHaveTextContent('Contains');
    expect(firstGrid.querySelectorAll('.cds--css-grid-column')[2]).toHaveTextContent('8.8.8.8');

    expect(secondGrid.querySelectorAll('.cds--css-grid-column')[0]).toHaveTextContent('issuedTo.alternativeName');
    expect(secondGrid.querySelectorAll('.cds--css-grid-column')[1]).toHaveTextContent('Matches');
    expect(secondGrid.querySelectorAll('.cds--css-grid-column')[2]).toHaveTextContent('test');
  });
});
