/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import CredentialList from 'in-synthetics/dashboards/global/CredentialList';

describe('CredentialList', () => {
  it('should render a Synthetic credential table', () => {
    const { container } = render(<CredentialList />);

    expect(screen.getByText('Credentials')).toBeVisible();

    expect(container.getElementsByTagName('th').length).toBe(5);
    expect(container.getElementsByTagName('th')[0]).toHaveTextContent('Name');
    expect(container.getElementsByTagName('th')[1]).toHaveTextContent('Associations');
    expect(container.getElementsByTagName('th')[2]).toHaveTextContent('Created at');
    expect(container.getElementsByTagName('th')[3]).toHaveTextContent('Created by');
    expect(container.getElementsByTagName('th')[4]).toHaveTextContent('Last modified by');
  });
});
