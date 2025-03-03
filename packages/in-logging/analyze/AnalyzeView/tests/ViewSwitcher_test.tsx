/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';

// eslint-disable-next-line no-restricted-imports
import ViewSwitcher, { getTimelineUrlKeys } from '../ViewSwitcher';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { Location } from 'in-stores/navigation/types';

describe('getTimelineUrlKeys', () => {
  it('should return undefined if location.query is empty', () => {
    const location: Location = {
      pathname: '/home',
      query: {},
      matrix: {}
    };

    expect(getTimelineUrlKeys(location)).toBeUndefined();
  });
});

jest.mock('in-stores/navigation/hooks/useNavigation', () => ({
  useNavigation: jest.fn()
}));

describe('ViewSwitcher', () => {
  it('should render and highlight the correct navigation item when analytics is active', () => {
    const mockCreateHref = jest.fn().mockReturnValue('/mock-href');
    const mockMatchLocation = jest.fn().mockReturnValue(true);
    const mockLocation = { pathname: '/logs', query: {} };

    (useNavigation as any).mockReturnValue({
      location: mockLocation,
      matchLocation: mockMatchLocation,
      createHref: mockCreateHref
    });

    render(
      <Router>
        <ViewSwitcher />
      </Router>
    );

    const analyticsLink = screen.getByText(/analytics/i);
    const alertsLink = screen.getByText(/smart alerts/i);

    expect(analyticsLink).toHaveClass('cds--tabs__nav-item-label');
    expect(alertsLink).not.toHaveClass('active');
  });

  it('should render and highlight the correct navigation item when smart alerts are active', () => {
    const mockCreateHref = jest.fn().mockReturnValue('/mock-href');
    const mockMatchLocation = jest.fn().mockReturnValue(true);
    const mockLocation = { pathname: '/alerts', query: {} };

    (useNavigation as any).mockReturnValue({
      location: mockLocation,
      matchLocation: mockMatchLocation,
      createHref: mockCreateHref
    });

    render(
      <Router>
        <ViewSwitcher />
      </Router>
    );

    const analyticsLink = screen.getByText(/analytics/i);
    const alertsLink = screen.getByText(/smart alerts/i);

    expect(alertsLink).toHaveClass('cds--tabs__nav-item-label');
    expect(analyticsLink).not.toHaveClass('active');
  });

  describe('getTimelineUrlKeys', () => {
    it('should return undefined if location.query is empty', () => {
      const location: Location = {
        pathname: '/home',
        query: {},
        matrix: {}
      };
      expect(getTimelineUrlKeys(location)).toBeUndefined();
    });

    it('should return the correct keys if location.query contains all parameters', () => {
      const location: Location = {
        pathname: '/home',
        query: {
          'timeline.to': '2025-01-01',
          'timeline.fm': '2025-01-02T12:00',
          'timeline.ws': 'large'
        },
        matrix: {}
      };
      const result = getTimelineUrlKeys(location);
      expect(result).toEqual({
        'timeline.to': '2025-01-01',
        'timeline.fm': '2025-01-02T12:00',
        'timeline.ws': 'large'
      });
    });

    it('should return only present keys from location.query', () => {
      const location: Location = {
        pathname: '/home',
        query: {
          'timeline.to': '2025-01-01',
          'timeline.ws': 'medium'
        },
        matrix: {}
      };
      const result = getTimelineUrlKeys(location);
      expect(result).toEqual({
        'timeline.to': '2025-01-01',
        'timeline.ws': 'medium'
      });
    });

    it('should return undefined for keys not present in location.query', () => {
      const location: Location = {
        pathname: '/home',
        query: {
          'timeline.to': '2025-01-01'
        },
        matrix: {}
      };
      const result = getTimelineUrlKeys(location);
      expect(result).toEqual({
        'timeline.to': '2025-01-01',
        'timeline.fm': undefined,
        'timeline.ws': undefined
      });
    });
  });
});
