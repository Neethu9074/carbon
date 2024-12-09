/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import Header from 'in-plg/components/Header/Header';

describe('Header Component', () => {
  test('renders correctly', () => {
    render(<Header crumbs={[{ icon: 'google_cloud_icon', title: 'google_cloud_icon' }]} />);
    const element = screen.getByText('google_cloud_icon');
    expect(element).toBeInTheDocument();
  });
});
