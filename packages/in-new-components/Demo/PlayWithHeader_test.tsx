/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import PlayWithHeader from './PlayWithHeader';
jest.mock('in-services/featureFlags', () => ({
  get playwithEnabled() {
    return true;
  }
}));

describe('demp/PlayWithHeader.tsx', () => {
  it('Checks the playwithheader loaded', () => {
    render(<PlayWithHeader />);
    expect(screen.getAllByText('Play with Instana')).toBeTruthy();
    expect(screen.getAllByText('Free trial')).toBeTruthy();
    expect(screen.getAllByText('Book a demo')).toBeTruthy();
  });
});
