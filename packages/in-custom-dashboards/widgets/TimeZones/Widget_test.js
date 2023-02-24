/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { Widget } from 'in-custom-dashboards/widgets/TimeZones';

describe('in-custom-dashboards/widgets/TimeZones', () => {
  jest.useFakeTimers();
  jest.setSystemTime(16725744000000); // Sunday, 1 January 2023 12:00:00

  it('renders current time correctly offset for selected timezones', () => {
    // Given
    const timeZones = [
      {
        timeZone: 'US/Eastern',
        label: 'EST'
      },
      {
        timeZone: 'UTC',
        label: ''
      },
      {
        timeZone: 'Europe/Berlin',
        label: 'Germany'
      }
    ];

    // When
    render(<Widget config={timeZones} />);

    // Then
    expect(screen.getByText('19:00')).toBeInTheDocument();
    expect(screen.getByText('00:00')).toBeInTheDocument();
    expect(screen.getByText('01:00')).toBeInTheDocument();
  });
});
