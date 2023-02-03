/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { fireEvent, render, screen } from '@testing-library/react';
import { createHashHistory, History } from 'history';
import { Router, useHistory } from 'react-router';
import React from 'react';

import LocationStateProvider, { useLocation } from 'in-stores/navigation/LocationStateProvider';
import history from 'in-stores/navigation/history';
import { ineum } from 'in-services/tracking/ineum';

jest.mock('in-services/tracking/ineum');

describe('in-stores/navigation/LocationStateProvider', () => {
  const TestComponent = function({ navTarget }: { navTarget: string }) {
    const location = useLocation();
    const h = useHistory();
    return (
      <div>
        <span data-testid="cookies">{location.matrix['/spaceship']?.cookies}</span>
        <span data-testid="rockets">{location.matrix['/spaceship']?.rockets}</span>
        <button data-testid="ignition" onClick={() => h.replace(navTarget)}>
          Ignition!
        </button>
      </div>
    );
  };

  // Ensure we have a consistent default location
  beforeEach(() => {
    window.location.hash = '#/spaceship;cookies=ready;rockets=fueled';
    jest.clearAllMocks();
  });

  describe('when used in combination with matrixAwareHistory', () => {
    it('correctly reads matrix parameters on location update', () => {
      // Given
      const path = '/spaceship;cookies=crumbly;rockets=ignited';

      // When
      render(
        <Router history={(history as unknown) as History}>
          <LocationStateProvider>
            <TestComponent navTarget={path} />
          </LocationStateProvider>
        </Router>
      );
      fireEvent.click(screen.getByTestId('ignition'));

      // Then
      expect(screen.getByTestId('cookies')).toHaveTextContent('crumbly');
      expect(screen.getByTestId('rockets')).toHaveTextContent('ignited');
    });
  });

  describe('when used in combination with vanilla react-router', () => {
    it('correctly reads matrix parameters on location update', () => {
      // Given
      const path = '/spaceship;cookies=crumbly;rockets=ignited';

      // When
      const localHistory = createHashHistory();
      render(
        <Router history={localHistory as History}>
          <LocationStateProvider>
            <TestComponent navTarget={path} />
          </LocationStateProvider>
        </Router>
      );
      fireEvent.click(screen.getByTestId('ignition'));

      // Then
      expect(screen.getByTestId('cookies')).toHaveTextContent('crumbly');
      expect(screen.getByTestId('rockets')).toHaveTextContent('ignited');
    });
  });

  it('updates ineum on location changes', () => {
    // Given
    const path = '/spaceship;cookies=crumbly;rockets=ignited/stage2';

    // When
    const localHistory = createHashHistory();
    render(
      <Router history={localHistory as History}>
        <LocationStateProvider>
          <TestComponent navTarget={path} />
        </LocationStateProvider>
      </Router>
    );
    fireEvent.click(screen.getByTestId('ignition'));

    // Then
    expect(ineum).toHaveBeenNthCalledWith(1, 'page', '/spaceship');
    expect(ineum).toHaveBeenNthCalledWith(2, 'page', '/spaceship/stage2');
  });
});
