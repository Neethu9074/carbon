/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { act, render } from '@testing-library/react';
import React from 'react';

import { useObservable } from '@instana/hooks';

import { addActiveDialog } from 'in-components/DialogPresenter/store';
import UserGoalSelection from 'in-plg/pages/UserGoalSelection';

jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));
jest.mock('in-components/DialogPresenter/store', () => ({
  addActiveDialog: jest.fn()
}));
jest.mock('in-plg/pages/WelcomePage/widgets/hooks/useGetAccountActivation', () =>
  jest.fn(() => ({
    key: { fs: { status: false } }
  }))
);
jest.mock('in-subscription/getUsageInfo', () => ({
  default: jest.fn(() => ({
    activeLicenseType: 'selfService'
  }))
}));

jest.mock('in-services/userSettings', () => ({
  userSettings: {
    showUserGoalSelection: true
  }
}));

describe('in-plg/pages/UserGoalSelection', () => {
  const mockData = {
    activeLicenseType: 'selfService'
  };

  beforeEach(() => {
    (useObservable as jest.Mock).mockImplementation(() => mockData);
  });
  test('should show dialog if first login and trial license', () => {
    act(() => {
      render(<UserGoalSelection />);
    });
    expect(addActiveDialog).toHaveBeenCalled();
  });
});
