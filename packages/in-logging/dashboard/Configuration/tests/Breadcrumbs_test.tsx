/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

// eslint-disable-next-line no-restricted-imports
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
// eslint-disable-next-line no-restricted-imports
import Breadcrumbs from '../Breadcrumbs';

jest.mock('in-stores/navigation/hooks/useNavigation', () => ({
  useNavigation: jest.fn()
}));

jest.mock('in-i18n', () => ({
  t: jest.fn(key => key)
}));

jest.mock('in-i18n', () => ({
  t: jest.fn(key => {
    const localisationStrings: Record<string, string> = {
      'in-logging:dashboard.configuration': 'Configuration',
      'in-logging:logs': 'Logs'
    };
    return localisationStrings[key] || key;
  })
}));

describe('Breadcrumbs Component', () => {
  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue({
      createHrefToPath: jest.fn(path => `/mocked-path${path}`),
      matchLocation: jest.fn(path => (path === 'mock/matched/path' ? true : false))
    });
  });

  test('renders breadcrumbs with correct links and labels', () => {
    render(<Breadcrumbs />);

    expect(screen.getByText('Logs')).toBeInTheDocument();
    expect(screen.getByText('Logs')).toHaveAttribute('href', '/mocked-path/logging');

    expect(screen.getByText('Configuration')).toBeInTheDocument();
    expect(screen.getByText('Configuration').closest('a')).toHaveAttribute('href', '/mocked-path/logging/configure');
  });

  test('renders breadcrumbs with default labels if no location matches', () => {
    (useNavigation as jest.Mock).mockReturnValueOnce({
      createHrefToPath: jest.fn(path => `/mocked-path${path}`),
      matchLocation: jest.fn(() => false)
    });

    render(<Breadcrumbs />);

    expect(screen.getByText('Logs')).toBeInTheDocument();
    expect(screen.getByText('Configuration')).toBeInTheDocument();

    const unmatchedLabel = screen.queryByText('Log Volume');
    expect(unmatchedLabel).not.toBeInTheDocument();
  });
});
