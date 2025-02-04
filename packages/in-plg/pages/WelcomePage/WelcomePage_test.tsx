/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import WelcomePage from 'in-plg/pages/WelcomePage/WelcomePage';

describe('in-plg/pages/WelcomePage', () => {
  beforeEach(jest.clearAllMocks);
  global.matchMedia =
    global.matchMedia ||
    function () {
      return {
        matches: false,
        matchMedia: function () {},
        addEventListener: function () {},
        removeListener: function () {}
      };
    };

  it('should render Welcomepage', () => {
    jest.mock('in-services/featureFlags', () => ({
      playwithEnabled: true
    }));
    render(<WelcomePage />);
    expect(screen.getByText('Welcome to Instana, Stan stan!')).toBeInTheDocument();
  });
});
