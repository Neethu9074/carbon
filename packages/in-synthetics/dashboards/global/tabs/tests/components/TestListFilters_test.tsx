/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { Result, SyntheticTest } from '@instana/types';

import TestListFilters from 'in-synthetics/dashboards/global/tabs/tests/components/TestListFilters';
import * as FilterUtils from 'in-synthetics/dashboards/global/tabs/tests/components/Filters';
import { FilterState } from 'in-synthetics/utils/constants';

// Mock feature flags module
jest.mock('in-services/featureFlags', () => ({
  syntheticRbacLimitedEnabled: true,
  syntheticDnsEnabled: true
}));

describe('TestListFilters', () => {
  const mockFilters: FilterState = {
    syntheticTypes: ['HTTPScript'],
    locationIds: ['location1'],
    entityIds: ['application']
  };

  const mockResult: Result<SyntheticTest[]> = {
    data: [
      {
        type: 'http',
        locationId: 'location1',
        entityId: 'entity1',
        applicationId: 'app1'
      } as unknown as SyntheticTest,
      {
        type: 'browser',
        locationId: 'location2',
        entityId: 'entity2',
        applicationId: 'app2'
      } as unknown as SyntheticTest
    ],
    errors: [],
    progress: {
      loading: false
    }
  };

  const mockSetFilters = jest.fn();

  beforeEach(() => {
    jest.spyOn(FilterUtils, 'getSyntheticTypes').mockReturnValue([
      { label: 'HTTP', value: 'http' },
      { label: 'Browser', value: 'browser' }
    ]);

    jest.spyOn(FilterUtils, 'getLocationLabels').mockReturnValue([
      { label: 'Location 1', value: 'location1' },
      { label: 'Location 2', value: 'location2' }
    ]);

    jest.spyOn(FilterUtils, 'getAssociationLabels').mockReturnValue([
      { label: 'Entity 1', value: 'entity1' },
      { label: 'Entity 2', value: 'entity2' }
    ]);

    jest.spyOn(FilterUtils, 'getApplicationLabels').mockReturnValue([
      { label: 'App 1', value: 'app1' },
      { label: 'App 2', value: 'app2' }
    ]);

    // Reset mocks
    mockSetFilters.mockClear();
  });

  it('renders the component correctly without any issues', () => {
    render(<TestListFilters filters={mockFilters} setFilters={mockSetFilters} result={mockResult} />);

    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Association')).toBeInTheDocument();
  });

  it('renders association filter when syntheticRbacLimitedEnabled is true', () => {
    render(<TestListFilters filters={mockFilters} setFilters={mockSetFilters} result={mockResult} />);

    expect(screen.getByText('Association')).toBeInTheDocument();
    expect(screen.queryByText('Application')).not.toBeInTheDocument();
  });

  it('does not render association or application filter when isAssociationsContext is true', () => {
    render(
      <TestListFilters filters={mockFilters} setFilters={mockSetFilters} result={mockResult} isAssociationsContext />
    );

    expect(screen.queryByText('Association')).not.toBeInTheDocument();
    expect(screen.queryByText('Application')).not.toBeInTheDocument();
  });
});
